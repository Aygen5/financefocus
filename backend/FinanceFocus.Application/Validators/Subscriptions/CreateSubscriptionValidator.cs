using FinanceFocus.Application.DTOs.Subscriptions;
using FluentValidation;

namespace FinanceFocus.Application.Validators.Subscriptions;

public class CreateSubscriptionValidator : AbstractValidator<CreateSubscriptionDto>
{
    public CreateSubscriptionValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Abonelik adı boş olamaz.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Abonelik fiyatı sıfırdan büyük olmalıdır.");

        RuleFor(x => x.BillingCycle)
            .NotEmpty().WithMessage("Faturalandırma periyodu boş olamaz.");
    }
}
