using FinanceFocus.Application.DTOs.Goals;
using FluentValidation;

namespace FinanceFocus.Application.Validators.Goals;

public class UpdateGoalValidator : AbstractValidator<UpdateGoalDto>
{
    public UpdateGoalValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Hedef adı boş olamaz.")
            .MaximumLength(150).WithMessage("Hedef adı 150 karakterden uzun olamaz.");

        RuleFor(x => x.TargetAmount)
            .GreaterThan(0).WithMessage("Hedeflenen tutar sıfırdan büyük olmalıdır.");

        RuleFor(x => x.CurrentAmount)
            .GreaterThanOrEqualTo(0).WithMessage("Mevcut birikim tutarı negatif olamaz.");
    }
}
