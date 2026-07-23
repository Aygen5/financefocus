using System.Threading.Tasks;
using Asp.Versioning;
using FinanceFocus.Application.DTOs.Subscriptions;
using FinanceFocus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiVersion("1.0")]
[Authorize]
public class SubscriptionsController : BaseApiController
{
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionsController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _subscriptionService.GetUserSubscriptionsAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary([FromQuery] int days = 7)
    {
        var result = await _subscriptionService.GetSubscriptionSummaryAsync(CurrentUserId, days);
        return ActionResultFrom(result);
    }

    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcoming([FromQuery] int days = 7)
    {
        var result = await _subscriptionService.GetUpcomingRenewalsAsync(CurrentUserId, days);
        return ActionResultFrom(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _subscriptionService.GetSubscriptionByIdAsync(id, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSubscriptionDto dto)
    {
        var result = await _subscriptionService.CreateSubscriptionAsync(dto, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateSubscriptionDto dto)
    {
        var result = await _subscriptionService.UpdateSubscriptionAsync(id, dto, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _subscriptionService.DeleteSubscriptionAsync(id, CurrentUserId);
        return ActionResultFrom(result);
    }
}
