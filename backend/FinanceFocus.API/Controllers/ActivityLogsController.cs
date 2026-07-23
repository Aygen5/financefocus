using System.Threading.Tasks;
using Asp.Versioning;
using FinanceFocus.Application.DTOs.ActivityLogs;
using FinanceFocus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiVersion("1.0")]
[Authorize]
public class ActivityLogsController : BaseApiController
{
    private readonly IActivityLogService _activityLogService;

    public ActivityLogsController(IActivityLogService activityLogService)
    {
        _activityLogService = activityLogService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category = null, [FromQuery] string? activityType = null)
    {
        var result = await _activityLogService.GetUserActivityLogsAsync(CurrentUserId, category, activityType);
        return ActionResultFrom(result);
    }

    [HttpGet("latest")]
    public async Task<IActionResult> GetLatest([FromQuery] int count = 5)
    {
        var result = await _activityLogService.GetLatestActivityLogsAsync(CurrentUserId, count);
        return ActionResultFrom(result);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var result = await _activityLogService.GetActivityLogSummaryAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _activityLogService.GetActivityLogByIdAsync(id, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateActivityLogDto dto)
    {
        var result = await _activityLogService.CreateActivityLogAsync(dto, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _activityLogService.DeleteActivityLogAsync(id, CurrentUserId);
        return ActionResultFrom(result);
    }
}
