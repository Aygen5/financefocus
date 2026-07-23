using FinanceFocus.Domain.Enums;

namespace FinanceFocus.Application.DTOs.Notifications;

public class CreateNotificationDto
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public NotificationType Type { get; set; } = NotificationType.Info;
    public string Category { get; set; } = "General";
}
