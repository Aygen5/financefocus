using System.Collections.Generic;
using System.Linq;

namespace FinanceFocus.Application.Common;

public class ApiResponse
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public IEnumerable<string> Errors { get; set; }

    public ApiResponse(bool success, string message, IEnumerable<string>? errors = null)
    {
        Success = success;
        Message = message;
        Errors = errors ?? Enumerable.Empty<string>();
    }

    public static ApiResponse SuccessResponse(string message = "")
    {
        return new ApiResponse(true, message);
    }

    public static ApiResponse FailureResponse(string message, IEnumerable<string>? errors = null)
    {
        return new ApiResponse(false, message, errors);
    }

    public static ApiResponse FailureResponse(IEnumerable<string> errors)
    {
        return new ApiResponse(false, string.Empty, errors);
    }
}
