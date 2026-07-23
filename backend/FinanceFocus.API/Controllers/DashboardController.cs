using System.Threading.Tasks;
using Asp.Versioning;
using FinanceFocus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiVersion("1.0")]
[Authorize]
public class DashboardController : BaseApiController
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<IActionResult> GetFullDashboard()
    {
        var result = await _dashboardService.GetFullDashboardAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var result = await _dashboardService.GetDashboardSummaryAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("recent-activities")]
    public async Task<IActionResult> GetRecentActivities([FromQuery] int count = 5)
    {
        var result = await _dashboardService.GetRecentActivitiesAsync(CurrentUserId, count);
        return ActionResultFrom(result);
    }

    [HttpGet("notifications")]
    public async Task<IActionResult> GetNotifications([FromQuery] int count = 5)
    {
        var result = await _dashboardService.GetRecentNotificationsAsync(CurrentUserId, count);
        return ActionResultFrom(result);
    }

    [HttpGet("budget-overview")]
    public async Task<IActionResult> GetBudgetOverview()
    {
        var result = await _dashboardService.GetBudgetOverviewAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("goals")]
    public async Task<IActionResult> GetGoals()
    {
        var result = await _dashboardService.GetGoalOverviewAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("portfolio")]
    public async Task<IActionResult> GetPortfolio()
    {
        var result = await _dashboardService.GetPortfolioOverviewAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("subscriptions")]
    public async Task<IActionResult> GetSubscriptions()
    {
        var result = await _dashboardService.GetSubscriptionOverviewAsync(CurrentUserId);
        return ActionResultFrom(result);
    }
}
