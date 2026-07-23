using System.Threading.Tasks;
using Asp.Versioning;
using FinanceFocus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/forecast")]
[Authorize]
public class ForecastController : BaseApiController
{
    private readonly IForecastEngineService _forecastEngineService;

    public ForecastController(IForecastEngineService forecastEngineService)
    {
        _forecastEngineService = forecastEngineService;
    }

    [HttpGet]
    public async Task<IActionResult> GetFullForecast()
    {
        var result = await _forecastEngineService.CalculateForecastAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var result = await _forecastEngineService.GetForecastSummaryAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("cashflow")]
    public async Task<IActionResult> GetCashFlow()
    {
        var result = await _forecastEngineService.GetCashFlowForecastAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("budgets")]
    public async Task<IActionResult> GetBudgets()
    {
        var result = await _forecastEngineService.GetBudgetForecastsAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("goals")]
    public async Task<IActionResult> GetGoals()
    {
        var result = await _forecastEngineService.GetGoalForecastsAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("portfolio")]
    public async Task<IActionResult> GetPortfolio()
    {
        var result = await _forecastEngineService.GetPortfolioForecastAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("subscriptions")]
    public async Task<IActionResult> GetSubscriptions()
    {
        var result = await _forecastEngineService.GetSubscriptionForecastAsync(CurrentUserId);
        return ActionResultFrom(result);
    }
}
