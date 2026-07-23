using System;

namespace FinanceFocus.Application.Exceptions;

public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message = "User authentication is required to access this resource.") 
        : base(message)
    {
    }
}
