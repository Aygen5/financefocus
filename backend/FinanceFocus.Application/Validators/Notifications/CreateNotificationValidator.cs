using FinanceFocus.Application.DTOs.Notifications;
using FluentValidation;

namespace FinanceFocus.Application.Validators.Notifications;

public class CreateNotificationValidator : AbstractValidator<CreateNotificationDto>
{
    public CreateNotificationValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Bildirim başlığı boş olamaz.")
            .MaximumLength(150).WithMessage("Başlık 150 karakterden uzun olamaz.");

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Bildirim mesajı boş olamaz.");
    }
}
