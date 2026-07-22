using System.Collections.Generic;

namespace FinanceFocus.Application.Common;

public class Result<T> : Result
{
    public T? Data { get; }

    private Result(bool isSuccess, T? data, string message, IEnumerable<string>? errors = null)
        : base(isSuccess, message, errors)
    {
        Data = data;
    }

    public static Result<T> Success(T data, string message = "")
    {
        return new Result<T>(true, data, message);
    }

    public new static Result<T> Failure(string message, IEnumerable<string>? errors = null)
    {
        return new Result<T>(false, default, message, errors);
    }

    public new static Result<T> Failure(IEnumerable<string> errors)
    {
        return new Result<T>(false, default, string.Empty, errors);
    }
}
