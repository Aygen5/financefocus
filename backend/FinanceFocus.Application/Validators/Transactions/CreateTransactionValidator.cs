using FinanceFocus.Application.DTOs.Transactions;
using FluentValidation;

namespace FinanceFocus.Application.Validators.Transactions;

public class CreateTransactionValidator : AbstractValidator<CreateTransactionDto>
{
    public CreateTransactionValidator()
    {
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Açıklama alanı boş olamaz.")
            .MaximumLength(250).WithMessage("Açıklama 250 karakterden uzun olamaz.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Tutar sıfırdan büyük olmalıdır.");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Kategori boş olamaz.");
    }
}
