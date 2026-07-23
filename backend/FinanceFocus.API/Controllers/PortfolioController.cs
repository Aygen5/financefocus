using System.Threading.Tasks;
using Asp.Versioning;
using FinanceFocus.Application.DTOs.Portfolio;
using FinanceFocus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiVersion("1.0")]
[Authorize]
public class PortfolioController : BaseApiController
{
    private readonly IPortfolioService _portfolioService;

    public PortfolioController(IPortfolioService portfolioService)
    {
        _portfolioService = portfolioService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _portfolioService.GetUserAssetsAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var result = await _portfolioService.GetPortfolioSummaryAsync(CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _portfolioService.GetAssetByIdAsync(id, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePortfolioAssetDto dto)
    {
        var result = await _portfolioService.CreateAssetAsync(dto, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdatePortfolioAssetDto dto)
    {
        var result = await _portfolioService.UpdateAssetAsync(id, dto, CurrentUserId);
        return ActionResultFrom(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _portfolioService.DeleteAssetAsync(id, CurrentUserId);
        return ActionResultFrom(result);
    }
}
