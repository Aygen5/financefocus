using System.Collections.Generic;
using System.Linq;
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

public class FinancialHealthScoreTests
{
    private const string TargetUserId = "user-health-test";

    private readonly Mock<IFinancialEngineService> _financialEngineServiceMock;
    private readonly Mock<IPortfolioService> _portfolioServiceMock;
    private readonly Mock<ISubscriptionService> _subscriptionServiceMock;
    private readonly Mock<IBudgetService> _budgetServiceMock;
    private readonly Mock<IGoalService> _goalServiceMock;
    private readonly FinancialHealthService _healthService;

    public FinancialHealthScoreTests()
    {
        _financialEngineServiceMock = new Mock<IFinancialEngineService>();
        _portfolioServiceMock = new Mock<IPortfolioService>();
        _subscriptionServiceMock = new Mock<ISubscriptionService>();
        _budgetServiceMock = new Mock<IBudgetService>();
        _goalServiceMock = new Mock<IGoalService>();

        _healthService = new FinancialHealthService(
            _financialEngineServiceMock.Object,
            _portfolioServiceMock.Object,
            _subscriptionServiceMock.Object,
            _budgetServiceMock.Object,
            _goalServiceMock.Object);
    }

    [Theory]
    [InlineData(90, "Excellent")]
    [InlineData(95, "Excellent")]
    [InlineData(100, "Excellent")]
    [InlineData(75, "Good")]
    [InlineData(89, "Good")]
    [InlineData(50, "Moderate")]
    [InlineData(74, "Moderate")]
    [InlineData(25, "Risky")]
    [InlineData(49, "Risky")]
    [InlineData(0, "Critical")]
    [InlineData(24, "Critical")]
    public async Task CalculateHealthScoreAsync_ShouldMapExactRiskLevel_ForBoundaryScores(int score, string expectedRiskLevel)
    {
        _financialEngineServiceMock.Setup(f => f.CalculateCoreMetricsAsync(TargetUserId))
            .ReturnsAsync(Result<FinancialCoreMetricsDto>.Success(new FinancialCoreMetricsDto
            {
                FinancialHealthScore = score,
                RiskLevel = expectedRiskLevel,
                MonthlyIncome = 100000m,
                MonthlyExpense = 50000m,
                SavingsRate = 50m
            }));

        _budgetServiceMock.Setup(b => b.GetUserBudgetsAsync(TargetUserId))
            .ReturnsAsync(Result<IEnumerable<BudgetDto>>.Success(new List<BudgetDto>()));
        _goalServiceMock.Setup(g => g.GetUserGoalsAsync(TargetUserId))
            .ReturnsAsync(Result<IEnumerable<GoalDto>>.Success(new List<GoalDto>()));
        _subscriptionServiceMock.Setup(s => s.GetSubscriptionSummaryAsync(TargetUserId))
            .ReturnsAsync(Result<SubscriptionSummaryDto>.Success(new SubscriptionSummaryDto()));
        _portfolioServiceMock.Setup(p => p.GetPortfolioSummaryAsync(TargetUserId))
            .ReturnsAsync(Result<PortfolioSummaryDto>.Success(new PortfolioSummaryDto()));

        var result = await _healthService.CalculateHealthScoreAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(score, result.Data.FinancialHealthScore);
        Assert.Equal(expectedRiskLevel, result.Data.RiskLevel);
    }

    [Fact]
    public async Task GetScoreBreakdownAsync_ShouldCalculateDetailedComponentScores_Correctly()
    {
        _financialEngineServiceMock.Setup(f => f.CalculateCoreMetricsAsync(TargetUserId))
            .ReturnsAsync(Result<FinancialCoreMetricsDto>.Success(new FinancialCoreMetricsDto
            {
                MonthlyIncome = 100000m,
                MonthlyExpense = 40000m,
                SavingsRate = 60m,
                TotalMonthlySubscriptionCost = 5000m,
                TotalPortfolioInvestment = 150000m,
                TotalPortfolioProfitLossPercentage = 15.0
            }));

        var budgets = new List<BudgetDto>
        {
            new BudgetDto { Category = "Market", Limit = 10000m, SpentAmount = 8000m },
            new BudgetDto { Category = "Fun", Limit = 5000m, SpentAmount = 4000m }
        };
        _budgetServiceMock.Setup(b => b.GetUserBudgetsAsync(TargetUserId))
            .ReturnsAsync(Result<IEnumerable<BudgetDto>>.Success(budgets));

        var goals = new List<GoalDto>
        {
            new GoalDto { TargetAmount = 10000m, CurrentAmount = 10000m }
        };
        _goalServiceMock.Setup(g => g.GetUserGoalsAsync(TargetUserId))
            .ReturnsAsync(Result<IEnumerable<GoalDto>>.Success(goals));

        var breakdownResult = await _healthService.GetScoreBreakdownAsync(TargetUserId);

        Assert.True(breakdownResult.IsSuccess);
        Assert.NotNull(breakdownResult.Data);

        var dto = breakdownResult.Data;
        Assert.Equal(25.00m, dto.IncomeExpenseScore);
        Assert.Equal(20.00m, dto.SavingsRateScore);
        Assert.Equal(15.00m, dto.BudgetAdherenceScore);
        Assert.Equal(15.00m, dto.GoalProgressScore);
        Assert.Equal(10.00m, dto.SubscriptionOverheadScore);
        Assert.Equal(10.00m, dto.PortfolioSizeScore);
        Assert.Equal(10.00m, dto.PortfolioProfitabilityScore);
        Assert.Equal(105.00m, dto.TotalScore);
    }

    [Fact]
    public async Task GetInsightsAsync_ShouldGenerateDeficitWarning_WhenExpensesExceedIncome()
    {
        _financialEngineServiceMock.Setup(f => f.CalculateCoreMetricsAsync(TargetUserId))
            .ReturnsAsync(Result<FinancialCoreMetricsDto>.Success(new FinancialCoreMetricsDto
            {
                MonthlyIncome = 20000m,
                MonthlyExpense = 35000m,
                SavingsRate = -75m
            }));

        _budgetServiceMock.Setup(b => b.GetUserBudgetsAsync(TargetUserId))
            .ReturnsAsync(Result<IEnumerable<BudgetDto>>.Success(new List<BudgetDto>()));

        var insightsResult = await _healthService.GetInsightsAsync(TargetUserId);

        Assert.True(insightsResult.IsSuccess);
        Assert.NotNull(insightsResult.Data);

        var deficitInsight = insightsResult.Data.FirstOrDefault(i => i.Category == "CashFlow");
        Assert.NotNull(deficitInsight);
        Assert.Equal("Warning", deficitInsight.Type);
        Assert.Contains("Bütçe Açığı Uyarısı", deficitInsight.Title);
    }
}
