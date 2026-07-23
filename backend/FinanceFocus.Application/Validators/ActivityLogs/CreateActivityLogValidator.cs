using FinanceFocus.Application.DTOs.ActivityLogs;
using FluentValidation;

namespace FinanceFocus.Application.Validators.ActivityLogs;

public class CreateActivityLogValidator : AbstractValidator<CreateActivityLogDto>
{
    public CreateActivityLogValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Aktivite başlığı boş olamaz.")
            .MaximumLength(200).WithMessage("Başlık 200 karakterden uzun olamaz.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Aktivite açıklaması boş olamaz.");
    }
}
