namespace FinanceFocus.Domain.Exceptions;

public class BusinessRuleException : DomainException
{
    public string Code { get; }

    public BusinessRuleException(string message, string code = "BUSINESS_RULE_VIOLATION") 
        : base(message)
    {
        Code = code;
    }
}
