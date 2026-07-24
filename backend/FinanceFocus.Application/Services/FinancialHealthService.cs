using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.FinancialHealth;
using FinanceFocus.Application.Interfaces;

namespace FinanceFocus.Application.Services;

public class FinancialHealthService : IFinancialHealthService
{
    private readonly IFinancialEngineService _financialEngineService;
    private readonly IPortfolioService _portfolioService;
    private readonly ISubscriptionService _subscriptionService;
    private readonly IBudgetService _budgetService;
    private readonly IGoalService _goalService;

    public FinancialHealthService(
        IFinancialEngineService financialEngineService,
        IPortfolioService portfolioService,
        ISubscriptionService subscriptionService,
        IBudgetService budgetService,
        IGoalService goalService)
    {
        _financialEngineService = financialEngineService;
        _portfolioService = portfolioService;
        _subscriptionService = subscriptionService;
        _budgetService = budgetService;
        _goalService = goalService;
    }

    public async Task<Result<FinancialHealthDto>> CalculateHealthScoreAsync(string userId)
    {
        var metricsResult = await _financialEngineService.CalculateCoreMetricsAsync(userId);
        var metrics = metricsResult.Data ?? new DTOs.FinancialEngine.FinancialCoreMetricsDto();

        var breakdown = (await GetScoreBreakdownAsync(userId)).Data ?? new ScoreBreakdownDto();
        var insights = (await GetInsightsAsync(userId)).Data ?? new List<FinancialInsightDto>();

        var dto = new FinancialHealthDto
        {
            FinancialHealthScore = metrics.FinancialHealthScore,
            RiskLevel = metrics.RiskLevel,
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
        var metricsResult = await _financialEngineService.CalculateCoreMetricsAsync(userId);
        var metrics = metricsResult.Data ?? new DTOs.FinancialEngine.FinancialCoreMetricsDto();

        var income = metrics.MonthlyIncome;
        var expense = metrics.MonthlyExpense;

        decimal incomeExpenseScore = income > expense ? 25m : (income > 0 ? Math.Max(0m, (income / (expense > 0 ? expense : 1m)) * 15m) : 10m);
        decimal savingsRateScore = metrics.SavingsRate switch
        {
            >= 30m => 20m,
            >= 20m => 16m,
            >= 10m => 12m,
            > 0m => 8m,
            _ => 0m
        };

        var budgets = (await _budgetService.GetUserBudgetsAsync(userId)).Data?.ToList() ?? new List<DTOs.Budgets.BudgetDto>();
        decimal budgetScore = budgets.Any() ? Math.Round(((decimal)budgets.Count(b => b.SpentAmount <= b.Limit) / budgets.Count) * 15m, 2) : 12m;

        var goals = (await _goalService.GetUserGoalsAsync(userId)).Data?.ToList() ?? new List<DTOs.Goals.GoalDto>();
        decimal goalScore = goals.Any() ? Math.Min(15m, Math.Round(((decimal)goals.Average(g => g.ProgressPercentage) / 100m) * 15m, 2)) : 10m;

        decimal subScore = income > 0 ? (((metrics.TotalMonthlySubscriptionCost / income) * 100m <= 10m) ? 10m : 5m) : 10m;
        decimal portfolioSizeScore = metrics.TotalPortfolioInvestment > 100000m ? 10m : (metrics.TotalPortfolioInvestment > 25000m ? 7m : 4m);
        decimal portfolioProfitScore = metrics.TotalPortfolioProfitLossPercentage >= 10.0 ? 10m : (metrics.TotalPortfolioProfitLossPercentage >= 0.0 ? 7m : 3m);

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
        var metricsResult = await _financialEngineService.CalculateCoreMetricsAsync(userId);
        var metrics = metricsResult.Data ?? new DTOs.FinancialEngine.FinancialCoreMetricsDto();

        if (metrics.MonthlyExpense > metrics.MonthlyIncome && metrics.MonthlyIncome > 0)
        {
            insights.Add(new FinancialInsightDto
            {
                Title = "Bütçe Açığı Uyarısı",
                Message = $"Bu ay harcamalarınız ({metrics.MonthlyExpense:N2} TL) gelirinizden ({metrics.MonthlyIncome:N2} TL) fazla.",
                Type = "Warning",
                Category = "CashFlow"
            });
        }
        else if (metrics.MonthlyIncome > 0)
        {
            if (metrics.SavingsRate >= 20m)
            {
                insights.Add(new FinancialInsightDto
                {
                    Title = "Yüksek Tasarruf Oranı",
                    Message = $"Tebrikler! Bu ayki tasarruf oranınız %{metrics.SavingsRate:N0} ile mükemmel seviyede.",
                    Type = "Success",
                    Category = "Savings"
                });
            }
            else
            {
                insights.Add(new FinancialInsightDto
                {
                    Title = "Düşük Tasarruf Oranı",
                    Message = $"Tasarruf oranınız (%{metrics.SavingsRate:N0}) ideal seviyenin (%20) altında.",
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

        if (metrics.TotalPortfolioInvestment > 0)
        {
            if (metrics.TotalPortfolioProfitLossPercentage > 0)
            {
                insights.Add(new FinancialInsightDto
                {
                    Title = "Portföy Getirisi Pozitif",
                    Message = $"Portföyünüz toplamda %{metrics.TotalPortfolioProfitLossPercentage:N2} kârda (+{metrics.TotalPortfolioProfitLoss:N2} TL).",
                    Type = "Success",
                    Category = "Portfolio"
                });
            }
        }

        if (metrics.TotalMonthlySubscriptionCost > 0 && metrics.MonthlyIncome > 0)
        {
            var subRatio = (metrics.TotalMonthlySubscriptionCost / metrics.MonthlyIncome) * 100m;
            if (subRatio >= 15m)
            {
                insights.Add(new FinancialInsightDto
                {
                    Title = "Abonelik Maliyet Yükü",
                    Message = $"Abonelik giderleriniz ({metrics.TotalMonthlySubscriptionCost:N2} TL) aylık gelirinizin %{subRatio:N0}'ini oluşturuyor.",
                    Type = "Info",
                    Category = "Subscriptions"
                });
            }
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
}
