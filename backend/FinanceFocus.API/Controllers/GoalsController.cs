using System.Threading.Tasks;
using Asp.Versioning;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiVersion("1.0")]
[Authorize]
public class GoalsController : BaseApiController
{
    private readonly IGoalService _goalService;

    public GoalsController(IGoalService goalService)
    {
        _goalService = goalService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _goalService.GetUserGoalsAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _goalService.GetGoalByIdAsync(id, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGoalDto dto)
    {
        var result = await _goalService.CreateGoalAsync(dto, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateGoalDto dto)
    {
        var result = await _goalService.UpdateGoalAsync(id, dto, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _goalService.DeleteGoalAsync(id, CurrentUserId);
        return ActionResultFrom(result);
    }
}
