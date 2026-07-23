using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.DTOs.Forecast;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.DTOs.Portfolio;
using FinanceFocus.Application.DTOs.Subscriptions;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class ForecastEngineService : IForecastEngineService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBudgetService _budgetService;
    private readonly IGoalService _goalService;
    private readonly IPortfolioService _portfolioService;
    private readonly ISubscriptionService _subscriptionService;

    public ForecastEngineService(
        IUnitOfWork unitOfWork,
        IBudgetService budgetService,
        IGoalService goalService,
        IPortfolioService portfolioService,
        ISubscriptionService subscriptionService)
    {
        _unitOfWork = unitOfWork;
        _budgetService = budgetService;
        _goalService = goalService;
        _portfolioService = portfolioService;
        _subscriptionService = subscriptionService;
    }

    public async Task<Result<ForecastDto>> CalculateForecastAsync(string userId)
    {
        var cashFlow = (await GetCashFlowForecastAsync(userId)).Data ?? new CashFlowForecastDto();
        var budgets = (await GetBudgetForecastsAsync(userId)).Data ?? new List<BudgetForecastDto>();
        var goals = (await GetGoalForecastsAsync(userId)).Data ?? new List<GoalForecastDto>();
        var portfolio = (await GetPortfolioForecastAsync(userId)).Data ?? new PortfolioForecastDto();
        var subscriptions = (await GetSubscriptionForecastAsync(userId)).Data ?? new SubscriptionForecastDto();
        var summary = (await GetForecastSummaryAsync(userId)).Data ?? new ForecastSummaryDto();

        var dto = new ForecastDto
        {
            CashFlow = cashFlow,
            Budgets = budgets,
            Goals = goals,
            Portfolio = portfolio,
            Subscriptions = subscriptions,
            Summary = summary,
            GeneratedAt = DateTime.UtcNow
        };

        return Result<ForecastDto>.Success(dto);
    }

    public async Task<Result<ForecastSummaryDto>> GetForecastSummaryAsync(string userId)
    {
        var cashFlow = (await GetCashFlowForecastAsync(userId)).Data;
        var budgets = (await GetBudgetForecastsAsync(userId)).Data?.ToList() ?? new List<BudgetForecastDto>();
        var goals = (await GetGoalForecastsAsync(userId)).Data?.ToList() ?? new List<GoalForecastDto>();
        var portfolio = (await GetPortfolioForecastAsync(userId)).Data;

        var highestRisk = budgets.Any(b => b.RiskLevel == "High") ? "High" :
                          budgets.Any(b => b.RiskLevel == "Medium") ? "Medium" : "Low";

        var earliestGoalCompletion = goals.Where(g => g.EstimatedCompletionDate.HasValue)
            .OrderBy(g => g.EstimatedCompletionDate)
            .Select(g => g.EstimatedCompletionDate)
            .FirstOrDefault();

        var summary = new ForecastSummaryDto
        {
            EstimatedMonthlyIncome = cashFlow?.EstimatedMonthlyIncome ?? 0m,
            EstimatedMonthlyExpense = cashFlow?.EstimatedMonthlyExpense ?? 0m,
            EstimatedSavings = cashFlow?.EstimatedMonthlySavings ?? 0m,
            BudgetRiskLevel = highestRisk,
            EstimatedGoalCompletionDate = earliestGoalCompletion,
            EstimatedPortfolioValue = portfolio?.ExpectedPortfolioValueIn12Months ?? 0m
        };

        return Result<ForecastSummaryDto>.Success(summary);
    }

    public async Task<Result<CashFlowForecastDto>> GetCashFlowForecastAsync(string userId)
    {
        var transactions = (await _unitOfWork.Transactions.GetByUserIdAsync(userId)).ToList();
        var now = DateTime.UtcNow;
        var monthTransactions = transactions
            .Where(t => t.TransactionDate.Year == now.Year && t.TransactionDate.Month == now.Month)
            .ToList();

        var currentIncome = monthTransactions.Where(t => t.TransactionType == TransactionType.Income).Sum(t => t.Amount);
        var currentExpense = monthTransactions.Where(t => t.TransactionType == TransactionType.Expense).Sum(t => t.Amount);

        var totalHistIncome = transactions.Where(t => t.TransactionType == TransactionType.Income).Sum(t => t.Amount);
        var totalHistExpense = transactions.Where(t => t.TransactionType == TransactionType.Expense).Sum(t => t.Amount);

        var estIncome = currentIncome > 0 ? currentIncome : (transactions.Any() ? totalHistIncome / Math.Max(1, transactions.Count) * 30m : 50000m);
        var estExpense = currentExpense > 0 ? Math.Round(currentExpense * 1.05m, 2) : (transactions.Any() ? totalHistExpense / Math.Max(1, transactions.Count) * 30m : 25000m);
        var estSavings = estIncome - estExpense;

        var dto = new CashFlowForecastDto
        {
            EstimatedMonthlyIncome = Math.Round(estIncome, 2),
            EstimatedMonthlyExpense = Math.Round(estExpense, 2),
            EstimatedMonthlySavings = Math.Round(estSavings, 2),
            AlgorithmUsed = "WeightedMovingAverage"
        };

        return Result<CashFlowForecastDto>.Success(dto);
    }

    public async Task<Result<IEnumerable<BudgetForecastDto>>> GetBudgetForecastsAsync(string userId)
    {
        var result = new List<BudgetForecastDto>();
        var budgets = (await _budgetService.GetUserBudgetsAsync(userId)).Data?.ToList() ?? new List<BudgetDto>();
        var now = DateTime.UtcNow;
        var currentDay = Math.Max(1, now.Day);
        var totalDaysInMonth = DateTime.DaysInMonth(now.Year, now.Month);

        foreach (var b in budgets)
        {
            var dailyRate = Math.Round(b.SpentAmount / currentDay, 2);
            var projectedExpense = Math.Round(dailyRate * totalDaysInMonth, 2);

            DateTime? depletionDate = null;
            if (dailyRate > 0 && b.SpentAmount < b.Limit)
            {
                var daysRemainingToDeplete = (int)Math.Floor((b.Limit - b.SpentAmount) / dailyRate);
                depletionDate = now.AddDays(daysRemainingToDeplete);
            }
            else if (b.SpentAmount >= b.Limit)
            {
                depletionDate = now;
            }

            var exceedProb = b.Limit > 0 ? Math.Min(100m, Math.Round((projectedExpense / b.Limit) * 100m, 2)) : 0m;
            var riskLevel = exceedProb switch
            {
                >= 100m => "High",
                >= 80m => "Medium",
                _ => "Low"
            };

            result.Add(new BudgetForecastDto
            {
                Category = b.Category,
                BudgetLimit = b.Limit,
                CurrentSpentAmount = b.SpentAmount,
                DailySpendingRate = dailyRate,
                ProjectedMonthEndExpense = projectedExpense,
                EstimatedDepletionDate = depletionDate,
                ExceedProbabilityPercentage = exceedProb,
                RiskLevel = riskLevel
            });
        }

        return Result<IEnumerable<BudgetForecastDto>>.Success(result);
    }

    public async Task<Result<IEnumerable<GoalForecastDto>>> GetGoalForecastsAsync(string userId)
    {
        var result = new List<GoalForecastDto>();
        var goals = (await _goalService.GetUserGoalsAsync(userId)).Data?.ToList() ?? new List<GoalDto>();
        var cashFlow = (await GetCashFlowForecastAsync(userId)).Data;
        var monthlySavings = cashFlow?.EstimatedMonthlySavings ?? 2000m;
        var contributionPerGoal = monthlySavings > 0 ? Math.Max(1000m, monthlySavings / Math.Max(1, goals.Count)) : 1000m;

        foreach (var g in goals)
        {
            var remaining = Math.Max(0m, g.TargetAmount - g.CurrentAmount);
            var monthsRemaining = remaining > 0 ? (int)Math.Ceiling(remaining / contributionPerGoal) : 0;
            var completionDate = monthsRemaining > 0 ? DateTime.UtcNow.AddMonths(monthsRemaining) : DateTime.UtcNow;

            var rec = remaining > 0
                ? $"Bu hızla devam ederseniz {g.Name} hedefinize {monthsRemaining} ay sonra ulaşabilirsiniz."
                : $"{g.Name} hedefinize başarıyla ulaştınız!";

            result.Add(new GoalForecastDto
            {
                GoalId = g.Id,
                GoalName = g.Name,
                TargetAmount = g.TargetAmount,
                CurrentAmount = g.CurrentAmount,
                RemainingAmount = remaining,
                MonthlySavingsContribution = Math.Round(contributionPerGoal, 2),
                EstimatedCompletionDate = completionDate,
                EstimatedMonthsRemaining = monthsRemaining,
                Recommendation = rec
            });
        }

        return Result<IEnumerable<GoalForecastDto>>.Success(result);
    }

    public async Task<Result<PortfolioForecastDto>> GetPortfolioForecastAsync(string userId)
    {
        var portfolio = (await _portfolioService.GetPortfolioSummaryAsync(userId)).Data;
        var currentInvestment = portfolio?.TotalInvestment ?? 0m;
        var currentValue = portfolio?.TotalCurrentValue ?? 0m;
        var profitLossPercentage = Convert.ToDecimal(portfolio?.TotalProfitLossPercentage ?? 0);

        var monthlyReturnRate = profitLossPercentage > 0 ? Math.Round(profitLossPercentage / 12m, 2) : 1m;
        var factor6 = (decimal)Math.Pow(1 + (double)(monthlyReturnRate / 100m), 6);
        var factor12 = (decimal)Math.Pow(1 + (double)(monthlyReturnRate / 100m), 12);

        var valueIn6Months = Math.Round(currentValue * factor6, 2);
        var valueIn12Months = Math.Round(currentValue * factor12, 2);
        var profitLossIn12Months = Math.Round(valueIn12Months - currentInvestment, 2);

        var dto = new PortfolioForecastDto
        {
            CurrentTotalInvestment = currentInvestment,
            CurrentTotalValue = currentValue,
            AverageReturnRatePercentage = monthlyReturnRate,
            ExpectedPortfolioValueIn6Months = valueIn6Months,
            ExpectedPortfolioValueIn12Months = valueIn12Months,
            ExpectedProfitLossIn12Months = profitLossIn12Months
        };

        return Result<PortfolioForecastDto>.Success(dto);
    }

    public async Task<Result<SubscriptionForecastDto>> GetSubscriptionForecastAsync(string userId)
    {
        var subSummary = (await _subscriptionService.GetSubscriptionSummaryAsync(userId)).Data;
        var monthlyCost = subSummary?.TotalMonthlyCost ?? 0m;
        var upcoming = subSummary?.UpcomingRenewals ?? new List<SubscriptionDto>();

        var dto = new SubscriptionForecastDto
        {
            ActiveSubscriptionCount = subSummary?.ActiveSubscriptionCount ?? 0,
            Next30DaysTotalCost = Math.Round(monthlyCost, 2),
            Next90DaysTotalCost = Math.Round(monthlyCost * 3m, 2),
            UpcomingRenewalsIn30Days = upcoming
        };

        return Result<SubscriptionForecastDto>.Success(dto);
    }
}
