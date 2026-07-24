using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.Common.Caching;
using FinanceFocus.Application.DTOs.FinancialEngine;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class FinancialEngineService : IFinancialEngineService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;

    public FinancialEngineService(IUnitOfWork unitOfWork, ICacheService cacheService)
    {
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
    }

    public async Task<Result<FinancialCoreMetricsDto>> CalculateCoreMetricsAsync(string userId)
    {
        var cacheKey = $"financial:engine:{userId}";
        var cached = await _cacheService.GetAsync<FinancialCoreMetricsDto>(cacheKey);
        if (cached != null)
        {
            return Result<FinancialCoreMetricsDto>.Success(cached);
        }

        var transactions = (await _unitOfWork.Transactions.GetByUserIdAsync(userId)).ToList();
        var subscriptions = (await _unitOfWork.Subscriptions.GetByUserIdAsync(userId)).ToList();
        var portfolioAssets = (await _unitOfWork.PortfolioAssets.GetByUserIdAsync(userId)).ToList();
        var budgets = (await _unitOfWork.Budgets.GetByUserIdAsync(userId)).ToList();
        var goals = (await _unitOfWork.Goals.GetByUserIdAsync(userId)).ToList();

        var totalIncomeHist = transactions.Where(t => t.TransactionType == TransactionType.Income).Sum(t => t.Amount);
        var totalExpenseHist = transactions.Where(t => t.TransactionType == TransactionType.Expense).Sum(t => t.Amount);
        var totalBalance = totalIncomeHist - totalExpenseHist;

        var refDate = transactions.Any() ? transactions.Max(t => t.TransactionDate) : DateTime.UtcNow;
        var targetMonthStart = DateTime.SpecifyKind(new DateTime(refDate.Year, refDate.Month, 1), DateTimeKind.Utc);
        var targetMonthEnd = targetMonthStart.AddMonths(1).AddTicks(-1);

        var currentMonthTxs = transactions
            .Where(t => t.TransactionDate >= targetMonthStart && t.TransactionDate <= targetMonthEnd)
            .ToList();

        if (!currentMonthTxs.Any() && transactions.Any())
        {
            currentMonthTxs = transactions;
        }

        var monthlyIncome = currentMonthTxs.Where(t => t.TransactionType == TransactionType.Income).Sum(t => t.Amount);
        var monthlyExpense = currentMonthTxs.Where(t => t.TransactionType == TransactionType.Expense).Sum(t => t.Amount);
        var netSavings = monthlyIncome - monthlyExpense;
        var savingsRate = monthlyIncome > 0 ? Math.Round((netSavings / monthlyIncome) * 100m, 2) : 0m;

        var subTotalCost = subscriptions.Where(s => s.IsActive).Sum(s =>
            s.BillingCycle.ToLower().Contains("year") ? Math.Round(s.Price / 12m, 2) : s.Price);
        var activeSubCount = subscriptions.Count(s => s.IsActive);

        var portInvestment = portfolioAssets.Sum(a => a.Amount * a.PurchasePrice);
        var portValue = portfolioAssets.Sum(a => a.Amount * a.CurrentPrice);
        var portProfitLoss = portValue - portInvestment;
        var portProfitLossPct = portInvestment > 0 ? (double)Math.Round(((portProfitLoss) / portInvestment) * 100m, 2) : 0.0;

        var trCulture = new CultureInfo("tr-TR");
        var cashFlowHistory = new List<CashFlowMonthDto>();
        for (int i = 5; i >= 0; i--)
        {
            var mDate = targetMonthStart.AddMonths(-i);
            var mStart = DateTime.SpecifyKind(new DateTime(mDate.Year, mDate.Month, 1), DateTimeKind.Utc);
            var mEnd = mStart.AddMonths(1).AddTicks(-1);

            var monthIncomes = transactions
                .Where(t => t.TransactionType == TransactionType.Income && t.TransactionDate >= mStart && t.TransactionDate <= mEnd)
                .Sum(t => t.Amount);
            var monthExpenses = transactions
                .Where(t => t.TransactionType == TransactionType.Expense && t.TransactionDate >= mStart && t.TransactionDate <= mEnd)
                .Sum(t => t.Amount);

            cashFlowHistory.Add(new CashFlowMonthDto
            {
                Month = mStart.ToString("MMM yy", trCulture),
                Income = monthIncomes,
                Expense = monthExpenses
            });
        }

        var categoryExpenses = transactions
            .Where(t => t.TransactionType == TransactionType.Expense)
            .GroupBy(t => t.Category)
            .Select(g =>
            {
                var catLimit = budgets.FirstOrDefault(b => b.Category.Equals(g.Key, StringComparison.OrdinalIgnoreCase))?.Limit ?? 0m;
                var catSpent = g.Sum(t => t.Amount);
                return new CategorySpendingDto
                {
                    Category = g.Key,
                    Amount = catSpent,
                    Limit = catLimit,
                    Percentage = catLimit > 0 ? (double)Math.Round((catSpent / catLimit) * 100m, 1) : 0.0
                };
            })
            .ToList();

        decimal incExpScore = monthlyIncome > monthlyExpense ? 25m : (monthlyIncome > 0 ? Math.Max(0m, (monthlyIncome / (monthlyExpense > 0 ? monthlyExpense : 1m)) * 15m) : 10m);
        decimal savRateScore = savingsRate >= 30m ? 20m : (savingsRate >= 20m ? 16m : (savingsRate >= 10m ? 12m : 8m));
        decimal budgetScore = budgets.Any() ? Math.Round(((decimal)budgets.Count(b =>
        {
            var spent = currentMonthTxs.Where(t => t.TransactionType == TransactionType.Expense && t.Category.Equals(b.Category, StringComparison.OrdinalIgnoreCase)).Sum(t => t.Amount);
            return spent <= b.Limit;
        }) / budgets.Count) * 15m, 2) : 12m;

        decimal goalScore = goals.Any() ? Math.Min(15m, Math.Round((goals.Average(g => g.TargetAmount > 0 ? (g.CurrentAmount / g.TargetAmount) * 100m : 0m) / 100m) * 15m, 2)) : 10m;
        decimal subScore = monthlyIncome > 0 ? ((subTotalCost / monthlyIncome) * 100m <= 10m ? 10m : 5m) : 10m;
        decimal portSizeScore = portInvestment > 100000m ? 10m : (portInvestment > 25000m ? 7m : 4m);
        decimal portProfScore = portProfitLossPct >= 10.0 ? 10m : (portProfitLossPct >= 0 ? 7m : 3m);

        int totalHealthScore = (int)Math.Clamp(Math.Round(incExpScore + savRateScore + budgetScore + goalScore + subScore + portSizeScore + portProfScore), 0, 100);
        string riskLevel = totalHealthScore switch
        {
            >= 90 => "Excellent",
            >= 75 => "Good",
            >= 50 => "Moderate",
            >= 25 => "Risky",
            _ => "Critical"
        };

        var dto = new FinancialCoreMetricsDto
        {
            TotalBalance = totalBalance,
            MonthlyIncome = monthlyIncome,
            MonthlyExpense = monthlyExpense,
            NetSavings = netSavings,
            SavingsRate = savingsRate,
            TotalPortfolioValue = portValue,
            TotalPortfolioInvestment = portInvestment,
            TotalPortfolioProfitLoss = portProfitLoss,
            TotalPortfolioProfitLossPercentage = portProfitLossPct,
            TotalMonthlySubscriptionCost = subTotalCost,
            ActiveSubscriptionCount = activeSubCount,
            FinancialHealthScore = totalHealthScore,
            RiskLevel = riskLevel,
            CashFlowHistory = cashFlowHistory,
            CategoryExpenses = categoryExpenses,
            CalculatedAt = DateTime.UtcNow
        };

        await _cacheService.SetAsync(cacheKey, dto, CacheDuration.Dashboard);

        return Result<FinancialCoreMetricsDto>.Success(dto);
    }
}
