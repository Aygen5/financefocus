using System.Collections.Generic;
using FinanceFocus.Application.DTOs.ActivityLogs;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.DTOs.Notifications;
using FinanceFocus.Application.DTOs.Portfolio;
using FinanceFocus.Application.DTOs.Subscriptions;
using FinanceFocus.Application.DTOs.Transactions;

namespace FinanceFocus.Application.DTOs.Dashboard;

public class DashboardDto
{
    public DashboardSummaryDto Summary { get; set; } = new();
    public IEnumerable<TransactionDto> RecentTransactions { get; set; } = new List<TransactionDto>();
    public IEnumerable<BudgetDto> Budgets { get; set; } = new List<BudgetDto>();
    public IEnumerable<GoalDto> Goals { get; set; } = new List<GoalDto>();
    public PortfolioSummaryDto Portfolio { get; set; } = new();
    public SubscriptionSummaryDto Subscriptions { get; set; } = new();
    public IEnumerable<NotificationDto> RecentNotifications { get; set; } = new List<NotificationDto>();
    public IEnumerable<ActivityLogDto> RecentActivities { get; set; } = new List<ActivityLogDto>();
}
