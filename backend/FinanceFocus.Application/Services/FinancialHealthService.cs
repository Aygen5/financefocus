using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.FinancialHealth;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class FinancialHealthService : IFinancialHealthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPortfolioService _portfolioService;
    private readonly ISubscriptionService _subscriptionService;
    private readonly IBudgetService _budgetService;
    private readonly IGoalService _goalService;

    public FinancialHealthService(
        IUnitOfWork unitOfWork,
        IPortfolioService portfolioService,
        ISubscriptionService subscriptionService,
        IBudgetService budgetService,
        IGoalService goalService)
    {
        _unitOfWork = unitOfWork;
        _portfolioService = portfolioService;
        _subscriptionService = subscriptionService;
        _budgetService = budgetService;
        _goalService = goalService;
    }

    public async Task<Result<FinancialHealthDto>> CalculateHealthScoreAsync(string userId)
    {
        var breakdown = (await GetScoreBreakdownAsync(userId)).Data ?? new ScoreBreakdownDto();
        var totalScore = (int)Math.Round(breakdown.TotalScore, MidpointRounding.AwayFromZero);
        totalScore = Math.Clamp(totalScore, 0, 100);

        var riskLevel = GetRiskLevel(totalScore);
        var insights = (await GetInsightsAsync(userId)).Data ?? new List<FinancialInsightDto>();

        var dto = new FinancialHealthDto
        {
            FinancialHealthScore = totalScore,
            RiskLevel = riskLevel,
            ScoreBreakdown = breakdown,
            Insights = insights,
            CalculationDate = DateTime.UtcNow
        };

        return Result<FinancialHealthDto>.Success(dto);
    }

    public async Task<Result<FinancialHealthSummaryDto>> GetHealthSummaryAsync(string userId)
    {
        var fullHealth = (await CalculateHealthScoreAsync(userId)).Data;
        var summary = new FinancialHealthSummaryDto
        {
            FinancialHealthScore = fullHealth?.FinancialHealthScore ?? 50,
            RiskLevel = fullHealth?.RiskLevel ?? "Moderate",
            TopInsights = fullHealth?.Insights.Take(5) ?? new List<FinancialInsightDto>()
        };

        return Result<FinancialHealthSummaryDto>.Success(summary);
    }

    public async Task<Result<ScoreBreakdownDto>> GetScoreBreakdownAsync(string userId)
    {
        var transactions = (await _unitOfWork.Transactions.GetByUserIdAsync(userId)).ToList();
        var now = DateTime.UtcNow;
        var monthTransactions = transactions
            .Where(t => t.TransactionDate.Year == now.Year && t.TransactionDate.Month == now.Month)
            .ToList();

        var income = monthTransactions.Where(t => t.TransactionType == TransactionType.Income).Sum(t => t.Amount);
        var expense = monthTransactions.Where(t => t.TransactionType == TransactionType.Expense).Sum(t => t.Amount);

        decimal incomeExpenseScore;
        if (income == 0 && expense == 0)
        {
            incomeExpenseScore = 15m;
        }
        else if (income > 0 && expense == 0)
        {
            incomeExpenseScore = 25m;
        }
        else if (income > expense)
        {
            incomeExpenseScore = Math.Min(25m, 15m + ((1m - (expense / income)) * 10m));
        }
        else
        {
            incomeExpenseScore = income > 0 ? Math.Max(0m, (income / expense) * 15m) : 0m;
        }

        var savingsRate = income > 0 ? ((income - expense) / income) * 100m : 0m;
        decimal savingsRateScore = savingsRate switch
        {
            >= 30m => 20m,
            >= 20m => 16m,
            >= 10m => 12m,
            > 0m => 8m,
            _ => 0m
        };

        var budgets = (await _budgetService.GetUserBudgetsAsync(userId)).Data?.ToList() ?? new List<DTOs.Budgets.BudgetDto>();
        decimal budgetScore;
        if (!budgets.Any())
        {
            budgetScore = 12m;
        }
        else
        {
            var compliantCount = budgets.Count(b => b.SpentAmount <= b.Limit);
            budgetScore = Math.Round(((decimal)compliantCount / budgets.Count) * 15m, 2);
        }

        var goals = (await _goalService.GetUserGoalsAsync(userId)).Data?.ToList() ?? new List<DTOs.Goals.GoalDto>();
        decimal goalScore;
        if (!goals.Any())
        {
            goalScore = 10m;
        }
        else
        {
            var avgProgress = Convert.ToDecimal(goals.Average(g => g.ProgressPercentage));
            goalScore = Math.Min(15m, Math.Round((avgProgress / 100m) * 15m, 2));
        }

        var subSummary = (await _subscriptionService.GetSubscriptionSummaryAsync(userId)).Data;
        var subMonthlyCost = subSummary?.TotalMonthlyCost ?? 0m;
        decimal subScore;
        if (income > 0)
        {
            var subRatio = (subMonthlyCost / income) * 100m;
            subScore = subRatio switch
            {
                <= 10m => 10m,
                <= 20m => 7m,
                <= 30m => 4m,
                _ => 0m
            };
        }
        else
        {
            subScore = subMonthlyCost == 0 ? 10m : 5m;
        }

        var portfolio = (await _portfolioService.GetPortfolioSummaryAsync(userId)).Data;
        var totalInvestment = portfolio?.TotalInvestment ?? 0m;
        decimal portfolioSizeScore = totalInvestment switch
        {
            > 100000m => 7.5m,
            > 25000m => 5m,
            > 0m => 3m,
            _ => 0m
        };

        var profitPercentage = Convert.ToDecimal(portfolio?.TotalProfitLossPercentage ?? 0);
        decimal portfolioProfitScore = profitPercentage switch
        {
            >= 20m => 7.5m,
            > 0m => 5m,
            0m => 2.5m,
            _ => 0m
        };

        var total = Math.Round(incomeExpenseScore + savingsRateScore + budgetScore + goalScore + subScore + portfolioSizeScore + portfolioProfitScore, 2);

        var breakdown = new ScoreBreakdownDto
        {
            TotalScore = total,
            IncomeExpenseScore = Math.Round(incomeExpenseScore, 2),
            SavingsRateScore = Math.Round(savingsRateScore, 2),
            BudgetAdherenceScore = Math.Round(budgetScore, 2),
            GoalProgressScore = Math.Round(goalScore, 2),
            SubscriptionOverheadScore = Math.Round(subScore, 2),
            PortfolioSizeScore = Math.Round(portfolioSizeScore, 2),
            PortfolioProfitabilityScore = Math.Round(portfolioProfitScore, 2)
        };

        return Result<ScoreBreakdownDto>.Success(breakdown);
    }

    public async Task<Result<IEnumerable<FinancialInsightDto>>> GetInsightsAsync(string userId)
    {
        var insights = new List<FinancialInsightDto>();

        var transactions = (await _unitOfWork.Transactions.GetByUserIdAsync(userId)).ToList();
        var now = DateTime.UtcNow;
        var monthTransactions = transactions
            .Where(t => t.TransactionDate.Year == now.Year && t.TransactionDate.Month == now.Month)
            .ToList();

        var income = monthTransactions.Where(t => t.TransactionType == TransactionType.Income).Sum(t => t.Amount);
        var expense = monthTransactions.Where(t => t.TransactionType == TransactionType.Expense).Sum(t => t.Amount);

        if (expense > income && income > 0)
        {
            insights.Add(new FinancialInsightDto
            {
                Title = "Bütçe Açığı Uyarısı",
                Message = $"Bu ay harcamalarınız ({expense:N2} TL) gelirinizden ({income:N2} TL) fazla.",
                Type = "Warning",
                Category = "CashFlow"
            });
        }
        else if (income > 0)
        {
            var savingsRate = ((income - expense) / income) * 100m;
            if (savingsRate >= 20m)
            {
                insights.Add(new FinancialInsightDto
                {
                    Title = "Yüksek Tasarruf Oranı",
                    Message = $"Tebrikler! Bu ayki tasarruf oranınız %{savingsRate:N0} ile mükemmel seviyede.",
                    Type = "Success",
                    Category = "Savings"
                });
            }
            else if (savingsRate < 10m)
            {
                insights.Add(new FinancialInsightDto
                {
                    Title = "Düşük Tasarruf Oranı",
                    Message = $"Tasarruf oranınız (%{savingsRate:N0}) ideal seviyenin (%20) altında.",
                    Type = "Warning",
                    Category = "Savings"
                });
            }
        }

        var budgets = (await _budgetService.GetUserBudgetsAsync(userId)).Data?.ToList() ?? new List<DTOs.Budgets.BudgetDto>();
        foreach (var b in budgets)
        {
            if (b.Limit > 0)
            {
                var usagePercent = (b.SpentAmount / b.Limit) * 100m;
                if (usagePercent >= 90m)
                {
                    insights.Add(new FinancialInsightDto
                    {
                        Title = "Bütçe Limiti Uyarısı",
                        Message = $"{b.Category} bütçenizin %{usagePercent:N0}'ini kullandınız ({b.SpentAmount:N2} TL / {b.Limit:N2} TL).",
                        Type = usagePercent >= 100m ? "Critical" : "Warning",
                        Category = "Budget"
                    });
                }
            }
        }

        var portfolio = (await _portfolioService.GetPortfolioSummaryAsync(userId)).Data;
        if (portfolio != null && portfolio.TotalInvestment > 0)
        {
            if (portfolio.TotalProfitLossPercentage > 0)
            {
                insights.Add(new FinancialInsightDto
                {
                    Title = "Portföy Getirisi Pozitif",
                    Message = $"Portföyünüz toplamda %{portfolio.TotalProfitLossPercentage:N2} kârda (+{portfolio.TotalProfitLoss:N2} TL).",
                    Type = "Success",
                    Category = "Portfolio"
                });
            }
            else if (portfolio.TotalProfitLossPercentage < 0)
            {
                insights.Add(new FinancialInsightDto
                {
                    Title = "Portföy Getirisi Negatif",
                    Message = $"Portföyünüz toplamda %{Math.Abs(portfolio.TotalProfitLossPercentage):N2} zararda ({portfolio.TotalProfitLoss:N2} TL).",
                    Type = "Warning",
                    Category = "Portfolio"
                });
            }
        }

        var subSummary = (await _subscriptionService.GetSubscriptionSummaryAsync(userId)).Data;
        if (subSummary != null && subSummary.TotalMonthlyCost > 0 && income > 0)
        {
            var subRatio = (subSummary.TotalMonthlyCost / income) * 100m;
            if (subRatio >= 15m)
            {
                insights.Add(new FinancialInsightDto
                {
                    Title = "Abonelik Maliyet Yükü",
                    Message = $"Abonelik giderleriniz ({subSummary.TotalMonthlyCost:N2} TL) aylık gelirinizin %{subRatio:N0}'ini oluşturuyor.",
                    Type = "Info",
                    Category = "Subscriptions"
                });
            }
        }

        var goals = (await _goalService.GetUserGoalsAsync(userId)).Data?.ToList() ?? new List<DTOs.Goals.GoalDto>();
        if (goals.Any())
        {
            var avgProgress = goals.Average(g => g.ProgressPercentage);
            insights.Add(new FinancialInsightDto
            {
                Title = "Finansal Hedef İlerlemesi",
                Message = $"Hedeflerinize ortalama %{avgProgress:N0} oranında ilerliyorsunuz.",
                Type = "Info",
                Category = "Goals"
            });
        }

        if (!insights.Any())
        {
            insights.Add(new FinancialInsightDto
            {
                Title = "Finansal Durum İstikrarlı",
                Message = "Finansal verileriniz dengeli ve düzenli görünmektedir.",
                Type = "Info",
                Category = "General"
            });
        }

        return Result<IEnumerable<FinancialInsightDto>>.Success(insights);
    }

    private static string GetRiskLevel(int score) => score switch
    {
        >= 90 => "Excellent",
        >= 75 => "Good",
        >= 50 => "Moderate",
        >= 25 => "Risky",
        _ => "Critical"
    };
}
