using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.DTOs.Portfolio;
using FinanceFocus.Application.DTOs.Subscriptions;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Application.Services;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Domain.UnitOfWork;
using Moq;
using Xunit;

namespace FinanceFocus.Tests;

public class FinancialHealthServiceTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IPortfolioService> _portfolioServiceMock;
    private readonly Mock<ISubscriptionService> _subscriptionServiceMock;
    private readonly Mock<IBudgetService> _budgetServiceMock;
    private readonly Mock<IGoalService> _goalServiceMock;
    private readonly Mock<ICacheService> _cacheServiceMock;
    private readonly FinancialHealthService _service;

    public FinancialHealthServiceTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _portfolioServiceMock = new Mock<IPortfolioService>();
        _subscriptionServiceMock = new Mock<ISubscriptionService>();
        _budgetServiceMock = new Mock<IBudgetService>();
        _goalServiceMock = new Mock<IGoalService>();
        _cacheServiceMock = new Mock<ICacheService>();

        _service = new FinancialHealthService(
            _unitOfWorkMock.Object,
            _portfolioServiceMock.Object,
            _subscriptionServiceMock.Object,
            _budgetServiceMock.Object,
            _goalServiceMock.Object,
            _cacheServiceMock.Object);
    }

    [Fact]
    public async Task CalculateHealthScoreAsync_ReturnsSuccessWithScore()
    {
        var userId = "test-user-id";
        _unitOfWorkMock.Setup(u => u.Transactions.GetByUserIdAsync(userId))
            .ReturnsAsync(new List<Transaction>());

        _budgetServiceMock.Setup(b => b.GetUserBudgetsAsync(userId))
            .ReturnsAsync(Result<IEnumerable<BudgetDto>>.Success(new List<BudgetDto>()));

        _goalServiceMock.Setup(g => g.GetUserGoalsAsync(userId))
            .ReturnsAsync(Result<IEnumerable<GoalDto>>.Success(new List<GoalDto>()));

        _subscriptionServiceMock.Setup(s => s.GetSubscriptionSummaryAsync(userId))
            .ReturnsAsync(Result<SubscriptionSummaryDto>.Success(new SubscriptionSummaryDto()));

        _portfolioServiceMock.Setup(p => p.GetPortfolioSummaryAsync(userId))
            .ReturnsAsync(Result<PortfolioSummaryDto>.Success(new PortfolioSummaryDto()));

        var result = await _service.CalculateHealthScoreAsync(userId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.True(result.Data.FinancialHealthScore >= 0 && result.Data.FinancialHealthScore <= 100);
    }
}
