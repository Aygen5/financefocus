using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.DTOs.FinancialEngine;
using FinanceFocus.Application.Services;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Tests.TestHelpers;
using Moq;
using Xunit;

namespace FinanceFocus.Tests;

public class FinancialEngineServiceTests
{
    private const string TargetUserId = "user-engine-test";

    [Fact]
    public async Task CalculateCoreMetricsAsync_ShouldReturnCachedDto_WhenCacheHitOccurs()
    {
        var mockUow = TestMockBuilder.CreateMockUnitOfWork();
        var mockCache = TestMockBuilder.CreateMockCacheService();

        var cachedDto = new FinancialCoreMetricsDto
        {
            MonthlyIncome = 120000m,
            MonthlyExpense = 60000m,
            NetSavings = 60000m,
            SavingsRate = 50m,
            FinancialHealthScore = 95,
            RiskLevel = "Excellent"
        };

        mockCache.Setup(c => c.GetAsync<FinancialCoreMetricsDto>($"financial:engine:{TargetUserId}", default))
            .ReturnsAsync(cachedDto);

        var service = new FinancialEngineService(mockUow.Object, mockCache.Object);

        var result = await service.CalculateCoreMetricsAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(95, result.Data.FinancialHealthScore);
        Assert.Equal("Excellent", result.Data.RiskLevel);
        Assert.Equal(120000m, result.Data.MonthlyIncome);
    }

    [Fact]
    public async Task CalculateCoreMetricsAsync_ShouldCalculateCorrectMetrics_WhenUserHasComplexFinancialData()
    {
        var now = DateTime.UtcNow;
        var transactions = new List<Transaction>
        {
            new Transaction { Id = "tx-1", UserId = TargetUserId, Amount = 120000m, TransactionType = TransactionType.Income, TransactionDate = now },
            new Transaction { Id = "tx-2", UserId = TargetUserId, Amount = 34050m, Category = "Housing", TransactionType = TransactionType.Expense, TransactionDate = now },
            new Transaction { Id = "tx-3", UserId = TargetUserId, Amount = 12500m, Category = "Groceries", TransactionType = TransactionType.Expense, TransactionDate = now },
            new Transaction { Id = "tx-4", UserId = TargetUserId, Amount = 6500m, Category = "Entertainment", TransactionType = TransactionType.Expense, TransactionDate = now }
        };

        var subscriptions = new List<Subscription>
        {
            new Subscription { Id = "sub-1", UserId = TargetUserId, Name = "Netflix", Price = 300m, BillingCycle = "Monthly", IsActive = true },
            new Subscription { Id = "sub-2", UserId = TargetUserId, Name = "AWS", Price = 1200m, BillingCycle = "Yearly", IsActive = true }
        };

        var portfolioAssets = new List<PortfolioAsset>
        {
            new PortfolioAsset { Id = "port-1", UserId = TargetUserId, Symbol = "AAPL", Amount = 100m, PurchasePrice = 1000m, CurrentPrice = 1200m }
        };

        var budgets = new List<Budget>
        {
            new Budget { Id = "b-1", UserId = TargetUserId, Category = "Housing", Limit = 35000m, Month = now },
            new Budget { Id = "b-2", UserId = TargetUserId, Category = "Groceries", Limit = 10000m, Month = now }
        };

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(
            transactions: transactions,
            subscriptions: subscriptions,
            portfolioAssets: portfolioAssets,
            budgets: budgets);

        var mockCache = TestMockBuilder.CreateMockCacheService();

        var service = new FinancialEngineService(mockUow.Object, mockCache.Object);

        var result = await service.CalculateCoreMetricsAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);

        var dto = result.Data;
        Assert.Equal(120000m, dto.MonthlyIncome);
        Assert.Equal(53050m, dto.MonthlyExpense);
        Assert.Equal(66950m, dto.NetSavings);
        Assert.Equal(55.79m, dto.SavingsRate);
        Assert.Equal(2.26m, dto.IncomeToExpenseRatio);
        Assert.Equal(400m, dto.TotalMonthlySubscriptionCost);
        Assert.Equal(100000m, dto.TotalPortfolioInvestment);
        Assert.Equal(120000m, dto.TotalPortfolioValue);
        Assert.Equal(20000m, dto.TotalPortfolioProfitLoss);
        Assert.Equal(20.0, dto.TotalPortfolioProfitLossPercentage);
        Assert.Equal("Housing", dto.LargestSpendingCategory);
        Assert.Equal(34050m, dto.LargestSpendingAmount);
        Assert.Equal(1, dto.OverBudgetCategoryCount);
    }

    [Fact]
    public async Task CalculateCoreMetricsAsync_ShouldReturnDefaultMetrics_WhenNoDataExists()
    {
        var mockUow = TestMockBuilder.CreateMockUnitOfWork();
        var mockCache = TestMockBuilder.CreateMockCacheService();

        var service = new FinancialEngineService(mockUow.Object, mockCache.Object);

        var result = await service.CalculateCoreMetricsAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);

        var dto = result.Data;
        Assert.Equal(0m, dto.MonthlyIncome);
        Assert.Equal(0m, dto.MonthlyExpense);
        Assert.Equal(0m, dto.NetSavings);
        Assert.Equal(0m, dto.SavingsRate);
        Assert.Equal(0m, dto.IncomeToExpenseRatio);
        Assert.Equal("Yok", dto.LargestSpendingCategory);
        Assert.Equal(0m, dto.LargestSpendingAmount);
        Assert.Equal(0, dto.OverBudgetCategoryCount);
    }
}
