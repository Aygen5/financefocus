using FinanceFocus.Application.DTOs.Budgets;
using FluentValidation;

namespace FinanceFocus.Application.Validators.Budgets;

public class UpdateBudgetValidator : AbstractValidator<UpdateBudgetDto>
{
    public UpdateBudgetValidator()
    {
        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Kategori boş olamaz.");

        RuleFor(x => x.Limit)
            .GreaterThan(0).WithMessage("Bütçe limiti sıfırdan büyük olmalıdır.");
    }
}
