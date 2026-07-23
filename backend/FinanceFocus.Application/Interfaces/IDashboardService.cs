using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.ActivityLogs;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.DTOs.Dashboard;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.DTOs.Notifications;
using FinanceFocus.Application.DTOs.Portfolio;
using FinanceFocus.Application.DTOs.Subscriptions;

namespace FinanceFocus.Application.Interfaces;

public interface IDashboardService
{
    Task<Result<DashboardDto>> GetFullDashboardAsync(string userId);
    Task<Result<DashboardSummaryDto>> GetDashboardSummaryAsync(string userId);
    Task<Result<IEnumerable<ActivityLogDto>>> GetRecentActivitiesAsync(string userId, int count = 5);
    Task<Result<IEnumerable<NotificationDto>>> GetRecentNotificationsAsync(string userId, int count = 5);
    Task<Result<IEnumerable<BudgetDto>>> GetBudgetOverviewAsync(string userId);
    Task<Result<IEnumerable<GoalDto>>> GetGoalOverviewAsync(string userId);
    Task<Result<PortfolioSummaryDto>> GetPortfolioOverviewAsync(string userId);
    Task<Result<SubscriptionSummaryDto>> GetSubscriptionOverviewAsync(string userId);
}
