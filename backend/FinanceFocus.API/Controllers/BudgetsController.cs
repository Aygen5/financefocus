using System.Threading.Tasks;
using Asp.Versioning;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiVersion("1.0")]
[Authorize]
public class BudgetsController : BaseApiController
{
    private readonly IBudgetService _budgetService;

    public BudgetsController(IBudgetService budgetService)
    {
        _budgetService = budgetService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _budgetService.GetUserBudgetsAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _budgetService.GetBudgetByIdAsync(id, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBudgetDto dto)
    {
        var result = await _budgetService.CreateBudgetAsync(dto, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateBudgetDto dto)
    {
        var result = await _budgetService.UpdateBudgetAsync(id, dto, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _budgetService.DeleteBudgetAsync(id, CurrentUserId);
        return ActionResultFrom(result);
    }
}
