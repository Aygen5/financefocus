using System.Collections.Generic;

namespace FinanceFocus.Application.Common;

public class ApiResponse<T> : ApiResponse
{
    public T? Data { get; set; }

    public ApiResponse(bool success, T? data, string message, IEnumerable<string>? errors = null)
        : base(success, message, errors)
    {
        Data = data;
    }

    public static ApiResponse<T> SuccessResponse(T data, string message = "")
    {
        return new ApiResponse<T>(true, data, message);
    }

    public new static ApiResponse<T> FailureResponse(string message, IEnumerable<string>? errors = null)
    {
        return new ApiResponse<T>(false, default, message, errors);
    }

    public new static ApiResponse<T> FailureResponse(IEnumerable<string> errors)
    {
        return new ApiResponse<T>(false, default, string.Empty, errors);
    }
}
