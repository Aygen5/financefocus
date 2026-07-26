using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.Services;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Tests.TestHelpers;
using FluentValidation;
using FluentValidation.Results;
using Moq;
using Xunit;

namespace FinanceFocus.Tests;

public class BudgetAnalysisTests
{
    private const string TargetUserId = "user-budget-test";
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IValidator<CreateBudgetDto>> _createValidatorMock;
    private readonly Mock<IValidator<UpdateBudgetDto>> _updateValidatorMock;

    public BudgetAnalysisTests()
    {
        _mapperMock = new Mock<IMapper>();
        _createValidatorMock = new Mock<IValidator<CreateBudgetDto>>();
        _updateValidatorMock = new Mock<IValidator<UpdateBudgetDto>>();

        _createValidatorMock.Setup(v => v.ValidateAsync(It.IsAny<CreateBudgetDto>(), default))
            .ReturnsAsync(new ValidationResult());
        _updateValidatorMock.Setup(v => v.ValidateAsync(It.IsAny<UpdateBudgetDto>(), default))
            .ReturnsAsync(new ValidationResult());
    }

    [Fact]
    public async Task GetUserBudgetsAsync_ShouldCalculateSpentAmount_OnlyForMatchingCategoryAndMonth()
    {
        var targetMonth = new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc);
        var budgetEntity = new Budget
        {
            Id = "b-1",
            UserId = TargetUserId,
            Category = "Market",
            Limit = 15000m,
            Month = targetMonth
        };

        var transactions = new List<Transaction>
        {
            new Transaction { Id = "t-1", UserId = TargetUserId, Category = "Market", Amount = 5000m, TransactionType = TransactionType.Expense, TransactionDate = new DateTime(2026, 7, 10, 0, 0, 0, DateTimeKind.Utc) },
            new Transaction { Id = "t-2", UserId = TargetUserId, Category = "Market", Amount = 3000m, TransactionType = TransactionType.Expense, TransactionDate = new DateTime(2026, 7, 20, 0, 0, 0, DateTimeKind.Utc) },
            new Transaction { Id = "t-3", UserId = TargetUserId, Category = "Market", Amount = 4000m, TransactionType = TransactionType.Expense, TransactionDate = new DateTime(2026, 6, 15, 0, 0, 0, DateTimeKind.Utc) },
            new Transaction { Id = "t-4", UserId = TargetUserId, Category = "Rent", Amount = 30000m, TransactionType = TransactionType.Expense, TransactionDate = new DateTime(2026, 7, 5, 0, 0, 0, DateTimeKind.Utc) },
            new Transaction { Id = "t-5", UserId = TargetUserId, Category = "Market", Amount = 10000m, TransactionType = TransactionType.Income, TransactionDate = new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc) }
        };

        _mapperMock.Setup(m => m.Map<BudgetDto>(It.IsAny<Budget>()))
            .Returns((Budget b) => new BudgetDto
            {
                Id = b.Id,
                Category = b.Category,
                Limit = b.Limit,
                Month = b.Month,
                UserId = b.UserId
            });

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(transactions: transactions, budgets: new List<Budget> { budgetEntity });
        var mockCache = TestMockBuilder.CreateMockCacheService();

        var service = new BudgetService(mockUow.Object, mockCache.Object, _mapperMock.Object, _createValidatorMock.Object, _updateValidatorMock.Object);

        var result = await service.GetUserBudgetsAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);

        var budgetDto = result.Data.FirstOrDefault();
        Assert.NotNull(budgetDto);
        Assert.Equal("Market", budgetDto.Category);
        Assert.Equal(15000m, budgetDto.Limit);
        Assert.Equal(8000m, budgetDto.SpentAmount);
    }

    [Theory]
    [InlineData(10000, 12000, true)]
    [InlineData(10000, 10000, false)]
    [InlineData(10000, 5000, false)]
    [InlineData(0, 3748, false)]
    public async Task EvaluateBudgetStatus_ShouldCorrectlyIdentifyOverBudgetCondition(decimal limit, decimal spent, bool expectedOverBudget)
    {
        var testDate = DateTime.UtcNow;
        var transactions = new List<Transaction>
        {
            new Transaction { Id = "t-1", UserId = TargetUserId, Category = "Entertainment", Amount = spent, TransactionType = TransactionType.Expense, TransactionDate = testDate }
        };
        var budgets = new List<Budget>
        {
            new Budget { Id = "b-1", UserId = TargetUserId, Category = "Entertainment", Limit = limit, Month = testDate }
        };

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(transactions: transactions, budgets: budgets);
        var mockCache = TestMockBuilder.CreateMockCacheService();
        var service = new FinancialEngineService(mockUow.Object, mockCache.Object);

        var result = await service.CalculateCoreMetricsAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);

        if (expectedOverBudget)
        {
            Assert.Equal(1, result.Data.OverBudgetCategoryCount);
        }
        else
        {
            Assert.Equal(0, result.Data.OverBudgetCategoryCount);
        }
    }

    [Fact]
    public async Task CreateBudgetAsync_ShouldReturnFailure_WhenDuplicateCategoryAndMonthIsAdded()
    {
        var targetMonth = new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc);
        var existingBudget = new Budget
        {
            Id = "b-1",
            UserId = TargetUserId,
            Category = "Market",
            Limit = 10000m,
            Month = targetMonth
        };

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(budgets: new List<Budget> { existingBudget });
        var mockCache = TestMockBuilder.CreateMockCacheService();

        var service = new BudgetService(mockUow.Object, mockCache.Object, _mapperMock.Object, _createValidatorMock.Object, _updateValidatorMock.Object);

        var createDto = new CreateBudgetDto
        {
            Category = "Market",
            Limit = 15000m,
            Month = targetMonth
        };

        var result = await service.CreateBudgetAsync(createDto, TargetUserId);

        Assert.False(result.IsSuccess);
        Assert.Contains("zaten tanımlanmış bir bütçe bulunmaktadır", result.Message);
    }
}
