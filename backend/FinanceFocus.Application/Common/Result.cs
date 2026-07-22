using System.Collections.Generic;
using System.Linq;

namespace FinanceFocus.Application.Common;

public class Result
{
    public bool IsSuccess { get; }
    public string Message { get; }
    public IEnumerable<string> Errors { get; }

    protected Result(bool isSuccess, string message, IEnumerable<string>? errors = null)
    {
        IsSuccess = isSuccess;
        Message = message;
        Errors = errors ?? Enumerable.Empty<string>();
    }

    public static Result Success(string message = "")
    {
        return new Result(true, message);
    }

    public static Result Failure(string message, IEnumerable<string>? errors = null)
    {
        return new Result(false, message, errors);
    }

    public static Result Failure(IEnumerable<string> errors)
    {
        return new Result(false, string.Empty, errors);
    }
}
