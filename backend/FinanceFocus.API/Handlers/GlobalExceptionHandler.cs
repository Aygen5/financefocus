using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FinanceFocus.Application.Exceptions;
using FinanceFocus.Domain.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FinanceFocus.API.Handlers;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    private readonly IHostEnvironment _env;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger, IHostEnvironment env)
    {
        _logger = logger;
        _env = env;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var correlationId = httpContext.Items["X-Correlation-ID"]?.ToString() ?? httpContext.TraceIdentifier;

        _logger.LogError(exception, "Unhandled exception occurred. TraceId: {TraceId}, Message: {Message}", 
            correlationId, exception.Message);

        var (statusCode, title, type, extensions) = MapException(exception);

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Type = type,
            Detail = _env.IsDevelopment() ? exception.Message : "An error occurred while processing your request.",
            Instance = httpContext.Request.Path
        };

        problemDetails.Extensions["traceId"] = correlationId;
        problemDetails.Extensions["timestamp"] = DateTime.UtcNow.ToString("o");

        if (extensions != null)
        {
            foreach (var kvp in extensions)
            {
                problemDetails.Extensions[kvp.Key] = kvp.Value;
            }
        }

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/problem+json";

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }

    private static (int StatusCode, string Title, string Type, Dictionary<string, object>? Extensions) MapException(Exception exception)
    {
        return exception switch
        {
            NotFoundException notFoundEx => (
                StatusCodes.Status404NotFound,
                "Resource Not Found",
                "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                null
            ),
            AppValidationException valEx => (
                StatusCodes.Status400BadRequest,
                "Validation Error",
                "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                new Dictionary<string, object> { ["errors"] = valEx.Errors }
            ),
            UnauthorizedException unauthEx => (
                StatusCodes.Status401Unauthorized,
                "Unauthorized Access",
                "https://tools.ietf.org/html/rfc7235#section-3.1",
                null
            ),
            ForbiddenException verbEx => (
                StatusCodes.Status403Forbidden,
                "Forbidden Access",
                "https://tools.ietf.org/html/rfc7231#section-6.5.3",
                null
            ),
            BusinessRuleException bizEx => (
                StatusCodes.Status422UnprocessableEntity,
                "Business Rule Violation",
                "https://tools.ietf.org/html/rfc4918#section-11.2",
                new Dictionary<string, object> { ["ruleCode"] = bizEx.Code }
            ),
            _ => (
                StatusCodes.Status500InternalServerError,
                "Internal Server Error",
                "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                null
            )
        };
    }
}
