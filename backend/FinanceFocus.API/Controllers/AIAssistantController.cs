using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Asp.Versioning;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Application.Services.Providers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinanceFocus.API.Controllers;

[ApiVersion("1.0")]
[Authorize]
public class AIAssistantController : BaseApiController
{
    private readonly IAIAssistantService _aiAssistantService;

    public AIAssistantController(IAIAssistantService aiAssistantService)
    {
        _aiAssistantService = aiAssistantService;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AIChatRequestDto request)
    {
        try
        {
            var result = await _aiAssistantService.ProcessChatMessageAsync(CurrentUserId, request);
            return ActionResultFrom(result);
        }
        catch (OllamaUnavailableException ex)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new
            {
                success = false,
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = $"Yapay zekâ yanıtı üretilirken bir hata oluştu: {ex.Message}"
            });
        }
    }

    [HttpPost("chat-stream")]
    public async Task ChatStream([FromBody] AIChatRequestDto request, CancellationToken cancellationToken)
    {
        Response.ContentType = "text/event-stream";
        Response.Headers["Cache-Control"] = "no-cache";
        Response.Headers["Connection"] = "keep-alive";

        try
        {
            await foreach (var token in _aiAssistantService.StreamChatMessageAsync(CurrentUserId, request, cancellationToken))
            {
                var bytes = Encoding.UTF8.GetBytes($"data: {token}\n\n");
                await Response.Body.WriteAsync(bytes, cancellationToken);
                await Response.Body.FlushAsync(cancellationToken);
            }
        }
        catch (OllamaUnavailableException ex)
        {
            var errBytes = Encoding.UTF8.GetBytes($"event: error\ndata: {ex.Message}\n\n");
            await Response.Body.WriteAsync(errBytes, cancellationToken);
            await Response.Body.FlushAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            var errBytes = Encoding.UTF8.GetBytes($"event: error\ndata: AI yanıtı üretilirken hata oluştu: {ex.Message}\n\n");
            await Response.Body.WriteAsync(errBytes, cancellationToken);
            await Response.Body.FlushAsync(cancellationToken);
        }
    }
}
