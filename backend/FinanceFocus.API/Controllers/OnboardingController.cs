using System.Threading.Tasks;
using Asp.Versioning;
using FinanceFocus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiVersion("1.0")]
[Authorize]
public class OnboardingController : BaseApiController
{
    private readonly IOnboardingService _onboardingService;

    public OnboardingController(IOnboardingService onboardingService)
    {
        _onboardingService = onboardingService;
    }

    [HttpPost("seed-demo-data")]
    public async Task<IActionResult> SeedDemoData()
    {
        var result = await _onboardingService.SeedDemoDataAsync(CurrentUserId);
        return ActionResultFrom(result);
    }
}
