namespace FinanceFocus.Domain.Exceptions;

public class NotFoundException : DomainException
{
    public NotFoundException(string message) : base(message)
    {
    }

    public NotFoundException(string name, object key) 
        : base($"'{name}' entity with key ({key}) was not found.")
    {
    }
}
