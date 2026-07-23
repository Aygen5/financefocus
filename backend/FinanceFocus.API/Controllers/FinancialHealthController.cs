using System.Threading.Tasks;
using Asp.Versioning;
using FinanceFocus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/financial-health")]
[Authorize]
public class FinancialHealthController : BaseApiController
{
    private readonly IFinancialHealthService _financialHealthService;

    public FinancialHealthController(IFinancialHealthService financialHealthService)
    {
        _financialHealthService = financialHealthService;
    }

    [HttpGet]
    public async Task<IActionResult> GetFullHealth()
    {
        var result = await _financialHealthService.CalculateHealthScoreAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var result = await _financialHealthService.GetHealthSummaryAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("insights")]
    public async Task<IActionResult> GetInsights()
    {
        var result = await _financialHealthService.GetInsightsAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("score")]
    public async Task<IActionResult> GetScoreBreakdown()
    {
        var result = await _financialHealthService.GetScoreBreakdownAsync(CurrentUserId);
        return ActionResultFrom(result);
    }
}
