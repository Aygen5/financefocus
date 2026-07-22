using FinanceFocus.Application.DTOs.AI;
using FluentValidation;

namespace FinanceFocus.Application.Validators.AI;

public class AIChatRequestValidator : AbstractValidator<AIChatRequestDto>
{
    public AIChatRequestValidator()
    {
        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Mesaj alanı boş olamaz.")
            .MaximumLength(2000).WithMessage("Mesaj 2000 karakterden uzun olamaz.");
    }
}
