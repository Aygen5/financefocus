using System.Security.Claims;
using FinanceFocus.Application.Common;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected string CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

    protected IActionResult ActionResultFrom<T>(Result<T> result)
    {
        if (result.IsSuccess)
        {
            return Ok(ApiResponse<T>.SuccessResponse(result.Data!, result.Message));
        }

        return BadRequest(ApiResponse<T>.FailureResponse(result.Message, result.Errors));
    }

    protected IActionResult ActionResultFrom(Result result)
    {
        if (result.IsSuccess)
        {
            return Ok(ApiResponse.SuccessResponse(result.Message));
        }

        return BadRequest(ApiResponse.FailureResponse(result.Message, result.Errors));
    }
}
