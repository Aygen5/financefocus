using FinanceFocus.Application.DTOs.AIAssistant;
using FluentValidation;

namespace FinanceFocus.Application.Validators.AI;

public class AIChatRequestValidator : AbstractValidator<AIChatRequestDto>
{
    public AIChatRequestValidator()
    {
        RuleFor(x => x.Prompt)
            .NotEmpty().WithMessage("Mesaj / Soru alanı boş olamaz.")
            .MaximumLength(4000).WithMessage("Mesaj 4000 karakterden uzun olamaz.");
    }
}
