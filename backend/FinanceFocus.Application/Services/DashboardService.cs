using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.ActivityLogs;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.DTOs.Dashboard;
using FinanceFocus.Application.DTOs.FinancialHealth;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.DTOs.Notifications;
using FinanceFocus.Application.DTOs.Portfolio;
using FinanceFocus.Application.DTOs.Subscriptions;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITransactionService _transactionService;
    private readonly IBudgetService _budgetService;
    private readonly IGoalService _goalService;
    private readonly IPortfolioService _portfolioService;
    private readonly ISubscriptionService _subscriptionService;
    private readonly INotificationService _notificationService;
    private readonly IActivityLogService _activityLogService;
    private readonly IFinancialHealthService _financialHealthService;
    private readonly IMapper _mapper;

    public DashboardService(
        IUnitOfWork unitOfWork,
        ITransactionService transactionService,
        IBudgetService budgetService,
        IGoalService goalService,
        IPortfolioService portfolioService,
        ISubscriptionService subscriptionService,
        INotificationService notificationService,
        IActivityLogService activityLogService,
        IFinancialHealthService financialHealthService,
        IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _transactionService = transactionService;
        _budgetService = budgetService;
        _goalService = goalService;
        _portfolioService = portfolioService;
        _subscriptionService = subscriptionService;
        _notificationService = notificationService;
        _activityLogService = activityLogService;
        _financialHealthService = financialHealthService;
        _mapper = mapper;
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
        var transactions = (await _unitOfWork.Transactions.GetByUserIdAsync(userId)).ToList();

        var totalIncome = transactions.Where(t => t.TransactionType == TransactionType.Income).Sum(t => t.Amount);
        var totalExpense = transactions.Where(t => t.TransactionType == TransactionType.Expense).Sum(t => t.Amount);
        var totalBalance = totalIncome - totalExpense;

        var now = DateTime.UtcNow;
        var currentMonthTransactions = transactions
            .Where(t => t.TransactionDate.Year == now.Year && t.TransactionDate.Month == now.Month)
            .ToList();

        var monthlyIncome = currentMonthTransactions.Where(t => t.TransactionType == TransactionType.Income).Sum(t => t.Amount);
        var monthlyExpense = currentMonthTransactions.Where(t => t.TransactionType == TransactionType.Expense).Sum(t => t.Amount);
        var netSavings = monthlyIncome - monthlyExpense;
        var savingsRate = monthlyIncome > 0 ? Math.Round((netSavings / monthlyIncome) * 100m, 2) : 0m;

        var healthSummary = (await _financialHealthService.GetHealthSummaryAsync(userId)).Data;

        var goals = (await _goalService.GetUserGoalsAsync(userId)).Data?.ToList() ?? new List<GoalDto>();
        var activeGoalCount = goals.Count(g => g.CurrentAmount < g.TargetAmount);
        var completedGoalCount = goals.Count(g => g.CurrentAmount >= g.TargetAmount);
        var avgGoalProgress = goals.Any() ? Convert.ToDecimal(Math.Round(goals.Average(g => g.ProgressPercentage), 2)) : 0m;

        var portfolioResult = await _portfolioService.GetPortfolioSummaryAsync(userId);
        var portfolio = portfolioResult.Data ?? new PortfolioSummaryDto();

        var subSummaryResult = await _subscriptionService.GetSubscriptionSummaryAsync(userId);
        var subSummary = subSummaryResult.Data ?? new SubscriptionSummaryDto();

        var unreadNotificationResult = await _notificationService.GetUnreadCountAsync(userId);
        var unreadNotifCount = unreadNotificationResult.Data;

        var activitiesResult = await _activityLogService.GetUserActivityLogsAsync(userId);
        var totalActivities = activitiesResult.Data?.Count() ?? 0;

        var summary = new DashboardSummaryDto
        {
            TotalBalance = totalBalance,
            MonthlyIncome = monthlyIncome,
            MonthlyExpense = monthlyExpense,
            NetSavings = netSavings,
            SavingsRate = savingsRate,
            FinancialHealthScore = healthSummary?.FinancialHealthScore ?? 50,
            RiskLevel = healthSummary?.RiskLevel ?? "Moderate",
            TopInsights = healthSummary?.TopInsights ?? new List<FinancialInsightDto>(),
            ActiveGoalCount = activeGoalCount,
            CompletedGoalCount = completedGoalCount,
            AverageGoalProgressPercentage = avgGoalProgress,
            PortfolioTotalInvestment = portfolio.TotalInvestment,
            PortfolioCurrentValue = portfolio.TotalCurrentValue,
            PortfolioTotalProfitLoss = portfolio.TotalProfitLoss,
            PortfolioTotalProfitLossPercentage = (decimal)portfolio.TotalProfitLossPercentage,
            ActiveSubscriptionCount = subSummary.ActiveSubscriptionCount,
            MonthlyTotalSubscriptionCost = subSummary.TotalMonthlyCost,
            UpcomingPaymentsCount = subSummary.UpcomingRenewalsCount,
            UnreadNotificationCount = unreadNotifCount,
            TotalActivityCount = totalActivities
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
