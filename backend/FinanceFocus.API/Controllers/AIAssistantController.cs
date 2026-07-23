using System.Threading.Tasks;
using Asp.Versioning;
using FinanceFocus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/aiassistant")]
[Authorize]
public class AIAssistantController : BaseApiController
{
    private readonly IAIAssistantService _aiAssistantService;

    public AIAssistantController(IAIAssistantService aiAssistantService)
    {
        _aiAssistantService = aiAssistantService;
    }

    [HttpGet]
    public async Task<IActionResult> GetFullAnalysis()
    {
        var result = await _aiAssistantService.GetFullAnalysisAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("advice")]
    public async Task<IActionResult> GetAdvice()
    {
        var result = await _aiAssistantService.GetAdvicesAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var result = await _aiAssistantService.GetSummaryAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("risk-analysis")]
    public async Task<IActionResult> GetRiskAnalysis()
    {
        var result = await _aiAssistantService.GetRiskAnalysisAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("opportunities")]
    public async Task<IActionResult> GetOpportunities()
    {
        var result = await _aiAssistantService.GetOpportunitiesAsync(CurrentUserId);
        return ActionResultFrom(result);
    }
}
