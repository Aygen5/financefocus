using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.ActivityLogs;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.DTOs.Dashboard;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.DTOs.Notifications;
using FinanceFocus.Application.DTOs.Portfolio;
using FinanceFocus.Application.DTOs.Subscriptions;
using FinanceFocus.Application.Interfaces;

namespace FinanceFocus.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IFinancialEngineService _financialEngineService;
    private readonly ITransactionService _transactionService;
    private readonly IBudgetService _budgetService;
    private readonly IGoalService _goalService;
    private readonly IPortfolioService _portfolioService;
    private readonly ISubscriptionService _subscriptionService;
    private readonly INotificationService _notificationService;
    private readonly IActivityLogService _activityLogService;

    public DashboardService(
        IFinancialEngineService financialEngineService,
        ITransactionService transactionService,
        IBudgetService budgetService,
        IGoalService goalService,
        IPortfolioService portfolioService,
        ISubscriptionService subscriptionService,
        INotificationService notificationService,
        IActivityLogService activityLogService)
    {
        _financialEngineService = financialEngineService;
        _transactionService = transactionService;
        _budgetService = budgetService;
        _goalService = goalService;
        _portfolioService = portfolioService;
        _subscriptionService = subscriptionService;
        _notificationService = notificationService;
        _activityLogService = activityLogService;
    }

    public async Task<Result<DashboardDto>> GetFullDashboardAsync(string userId)
    {
        var summaryResult = await GetDashboardSummaryAsync(userId);
        var summary = summaryResult.Data ?? new DashboardSummaryDto();

        var recentTransactions = (await _transactionService.GetUserTransactionsAsync(userId)).Data?.Take(5) ?? new List<DTOs.Transactions.TransactionDto>();
        var budgets = (await _budgetService.GetUserBudgetsAsync(userId)).Data ?? new List<BudgetDto>();
        var goals = (await _goalService.GetUserGoalsAsync(userId)).Data ?? new List<GoalDto>();
        var portfolio = (await _portfolioService.GetPortfolioSummaryAsync(userId)).Data ?? new PortfolioSummaryDto();
        var subscriptions = (await _subscriptionService.GetSubscriptionSummaryAsync(userId)).Data ?? new SubscriptionSummaryDto();
        var recentNotifications = (await _notificationService.GetLatestNotificationsAsync(userId, 5)).Data ?? new List<NotificationDto>();
        var recentActivities = (await _activityLogService.GetLatestActivityLogsAsync(userId, 5)).Data ?? new List<ActivityLogDto>();

        var dashboard = new DashboardDto
        {
            Summary = summary,
            RecentTransactions = recentTransactions,
            Budgets = budgets,
            Goals = goals,
            Portfolio = portfolio,
            Subscriptions = subscriptions,
            RecentNotifications = recentNotifications,
            RecentActivities = recentActivities
        };

        return Result<DashboardDto>.Success(dashboard);
    }

    public async Task<Result<DashboardSummaryDto>> GetDashboardSummaryAsync(string userId)
    {
        var metricsResult = await _financialEngineService.CalculateCoreMetricsAsync(userId);
        var metrics = metricsResult.Data ?? new DTOs.FinancialEngine.FinancialCoreMetricsDto();

        var goals = (await _goalService.GetUserGoalsAsync(userId)).Data?.ToList() ?? new List<GoalDto>();
        var activeGoalCount = goals.Count(g => g.CurrentAmount < g.TargetAmount);
        var completedGoalCount = goals.Count(g => g.CurrentAmount >= g.TargetAmount);
        var avgGoalProgress = goals.Any() ? Convert.ToDecimal(Math.Round(goals.Average(g => g.ProgressPercentage), 2)) : 0m;

        var unreadNotifCount = (await _notificationService.GetUnreadCountAsync(userId)).Data;
        var totalActivities = (await _activityLogService.GetUserActivityLogsAsync(userId)).Data?.Count() ?? 0;

        var summary = new DashboardSummaryDto
        {
            TotalBalance = metrics.TotalBalance,
            MonthlyIncome = metrics.MonthlyIncome,
            MonthlyExpense = metrics.MonthlyExpense,
            NetSavings = metrics.NetSavings,
            SavingsRate = metrics.SavingsRate,
            FinancialHealthScore = metrics.FinancialHealthScore,
            RiskLevel = metrics.RiskLevel,
            EstimatedMonthlyIncome = metrics.MonthlyIncome,
            EstimatedMonthlyExpense = metrics.MonthlyExpense,
            EstimatedSavings = metrics.NetSavings,
            BudgetRiskLevel = "Low",
            EstimatedPortfolioValue = metrics.TotalPortfolioValue,
            ActiveGoalCount = activeGoalCount,
            CompletedGoalCount = completedGoalCount,
            AverageGoalProgressPercentage = avgGoalProgress,
            PortfolioTotalInvestment = metrics.TotalPortfolioInvestment,
            PortfolioCurrentValue = metrics.TotalPortfolioValue,
            PortfolioTotalProfitLoss = metrics.TotalPortfolioProfitLoss,
            PortfolioTotalProfitLossPercentage = (decimal)metrics.TotalPortfolioProfitLossPercentage,
            ActiveSubscriptionCount = metrics.ActiveSubscriptionCount,
            MonthlyTotalSubscriptionCost = metrics.TotalMonthlySubscriptionCost,
            UpcomingPaymentsCount = metrics.ActiveSubscriptionCount,
            UnreadNotificationCount = unreadNotifCount,
            TotalActivityCount = totalActivities,
            CashFlowHistory = metrics.CashFlowHistory
        };

        return Result<DashboardSummaryDto>.Success(summary);
    }

    public async Task<Result<IEnumerable<ActivityLogDto>>> GetRecentActivitiesAsync(string userId, int count = 5)
    {
        return await _activityLogService.GetLatestActivityLogsAsync(userId, count);
    }

    public async Task<Result<IEnumerable<NotificationDto>>> GetRecentNotificationsAsync(string userId, int count = 5)
    {
        return await _notificationService.GetLatestNotificationsAsync(userId, count);
    }

    public async Task<Result<IEnumerable<BudgetDto>>> GetBudgetOverviewAsync(string userId)
    {
        return await _budgetService.GetUserBudgetsAsync(userId);
    }

    public async Task<Result<IEnumerable<GoalDto>>> GetGoalOverviewAsync(string userId)
    {
        return await _goalService.GetUserGoalsAsync(userId);
    }

    public async Task<Result<PortfolioSummaryDto>> GetPortfolioOverviewAsync(string userId)
    {
        return await _portfolioService.GetPortfolioSummaryAsync(userId);
    }

    public async Task<Result<SubscriptionSummaryDto>> GetSubscriptionOverviewAsync(string userId)
    {
        return await _subscriptionService.GetSubscriptionSummaryAsync(userId);
    }
}
