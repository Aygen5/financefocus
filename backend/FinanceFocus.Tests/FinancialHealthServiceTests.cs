using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.DTOs.FinancialEngine;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.DTOs.Portfolio;
using FinanceFocus.Application.DTOs.Subscriptions;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Application.Services;
using Moq;
using Xunit;

namespace FinanceFocus.Tests;

public class FinancialHealthServiceTests
{
    private readonly Mock<IFinancialEngineService> _financialEngineServiceMock;
    private readonly Mock<IPortfolioService> _portfolioServiceMock;
    private readonly Mock<ISubscriptionService> _subscriptionServiceMock;
    private readonly Mock<IBudgetService> _budgetServiceMock;
    private readonly Mock<IGoalService> _goalServiceMock;
    private readonly FinancialHealthService _service;

    public FinancialHealthServiceTests()
    {
        _financialEngineServiceMock = new Mock<IFinancialEngineService>();
        _portfolioServiceMock = new Mock<IPortfolioService>();
        _subscriptionServiceMock = new Mock<ISubscriptionService>();
        _budgetServiceMock = new Mock<IBudgetService>();
        _goalServiceMock = new Mock<IGoalService>();

        _service = new FinancialHealthService(
            _financialEngineServiceMock.Object,
            _portfolioServiceMock.Object,
            _subscriptionServiceMock.Object,
            _budgetServiceMock.Object,
            _goalServiceMock.Object);
    }

    [Fact]
    public async Task CalculateHealthScoreAsync_ReturnsSuccessWithScore()
    {
        var userId = "test-user-id";
        _financialEngineServiceMock.Setup(f => f.CalculateCoreMetricsAsync(userId))
            .ReturnsAsync(Result<FinancialCoreMetricsDto>.Success(new FinancialCoreMetricsDto
            {
                FinancialHealthScore = 90,
                RiskLevel = "Excellent",
                MonthlyIncome = 120000,
                MonthlyExpense = 60998,
                NetSavings = 59002,
                SavingsRate = 49.17m
            }));

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
        Assert.Equal(90, result.Data.FinancialHealthScore);
    }
}
