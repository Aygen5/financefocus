using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Services;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Tests.TestHelpers;
using Xunit;

namespace FinanceFocus.Tests;

public class SavingsRateTests
{
    private const string TargetUserId = "user-savings-test";

    [Fact]
    public async Task CalculateSavingsRate_ShouldReturnFiftyPercent_WhenIncomeIs120000AndExpenseIs60000()
    {
        var testDate = DateTime.UtcNow;
        var transactions = new List<Transaction>
        {
            new Transaction { Id = "tx-1", UserId = TargetUserId, Amount = 120000m, TransactionType = TransactionType.Income, TransactionDate = testDate },
            new Transaction { Id = "tx-2", UserId = TargetUserId, Amount = 60000m, TransactionType = TransactionType.Expense, TransactionDate = testDate }
        };

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(transactions: transactions);
        var mockCache = TestMockBuilder.CreateMockCacheService();
        var service = new FinancialEngineService(mockUow.Object, mockCache.Object);

        var result = await service.CalculateCoreMetricsAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(120000m, result.Data.MonthlyIncome);
        Assert.Equal(60000m, result.Data.MonthlyExpense);
        Assert.Equal(60000m, result.Data.NetSavings);
        Assert.Equal(50.00m, result.Data.SavingsRate);
    }

    [Fact]
    public async Task CalculateSavingsRate_ShouldReturnZero_WhenIncomeIsZero()
    {
        var testDate = DateTime.UtcNow;
        var transactions = new List<Transaction>
        {
            new Transaction { Id = "tx-1", UserId = TargetUserId, Amount = 15000m, TransactionType = TransactionType.Expense, TransactionDate = testDate }
        };

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(transactions: transactions);
        var mockCache = TestMockBuilder.CreateMockCacheService();
        var service = new FinancialEngineService(mockUow.Object, mockCache.Object);

        var result = await service.CalculateCoreMetricsAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(0m, result.Data.MonthlyIncome);
        Assert.Equal(15000m, result.Data.MonthlyExpense);
        Assert.Equal(-15000m, result.Data.NetSavings);
        Assert.Equal(0m, result.Data.SavingsRate);
    }

    [Fact]
    public async Task CalculateSavingsRate_ShouldReturnNegativeSavingsRate_WhenExpenseExceedsIncome()
    {
        var testDate = DateTime.UtcNow;
        var transactions = new List<Transaction>
        {
            new Transaction { Id = "tx-1", UserId = TargetUserId, Amount = 50000m, TransactionType = TransactionType.Income, TransactionDate = testDate },
            new Transaction { Id = "tx-2", UserId = TargetUserId, Amount = 80000m, TransactionType = TransactionType.Expense, TransactionDate = testDate }
        };

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(transactions: transactions);
        var mockCache = TestMockBuilder.CreateMockCacheService();
        var service = new FinancialEngineService(mockUow.Object, mockCache.Object);

        var result = await service.CalculateCoreMetricsAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(50000m, result.Data.MonthlyIncome);
        Assert.Equal(80000m, result.Data.MonthlyExpense);
        Assert.Equal(-30000m, result.Data.NetSavings);
        Assert.Equal(-60.00m, result.Data.SavingsRate);
    }

    [Fact]
    public async Task CalculateSavingsRate_ShouldReturnOneHundredPercent_WhenExpenseIsZero()
    {
        var testDate = DateTime.UtcNow;
        var transactions = new List<Transaction>
        {
            new Transaction { Id = "tx-1", UserId = TargetUserId, Amount = 100000m, TransactionType = TransactionType.Income, TransactionDate = testDate }
        };

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(transactions: transactions);
        var mockCache = TestMockBuilder.CreateMockCacheService();
        var service = new FinancialEngineService(mockUow.Object, mockCache.Object);

        var result = await service.CalculateCoreMetricsAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(100000m, result.Data.MonthlyIncome);
        Assert.Equal(0m, result.Data.MonthlyExpense);
        Assert.Equal(100000m, result.Data.NetSavings);
        Assert.Equal(100.00m, result.Data.SavingsRate);
    }

    [Fact]
    public async Task CalculateSavingsRate_ShouldRoundToTwoDecimalPlaces_WhenFractionalRateOccurs()
    {
        var testDate = DateTime.UtcNow;
        var transactions = new List<Transaction>
        {
            new Transaction { Id = "tx-1", UserId = TargetUserId, Amount = 300000m, TransactionType = TransactionType.Income, TransactionDate = testDate },
            new Transaction { Id = "tx-2", UserId = TargetUserId, Amount = 100000m, TransactionType = TransactionType.Expense, TransactionDate = testDate }
        };

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(transactions: transactions);
        var mockCache = TestMockBuilder.CreateMockCacheService();
        var service = new FinancialEngineService(mockUow.Object, mockCache.Object);

        var result = await service.CalculateCoreMetricsAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(66.67m, result.Data.SavingsRate);
    }

    [Fact]
    public async Task CalculateSavingsRate_ShouldReturnZero_WhenNoTransactionsExist()
    {
        var mockUow = TestMockBuilder.CreateMockUnitOfWork();
        var mockCache = TestMockBuilder.CreateMockCacheService();
        var service = new FinancialEngineService(mockUow.Object, mockCache.Object);

        var result = await service.CalculateCoreMetricsAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(0m, result.Data.MonthlyIncome);
        Assert.Equal(0m, result.Data.MonthlyExpense);
        Assert.Equal(0m, result.Data.NetSavings);
        Assert.Equal(0m, result.Data.SavingsRate);
    }
}
