using System.Collections.Generic;

namespace FinanceFocus.Application.DTOs.Notifications;

public class NotificationSummaryDto
{
    public int UnreadCount { get; set; }
    public int TotalCount { get; set; }
    public IEnumerable<NotificationDto> LatestNotifications { get; set; } = new List<NotificationDto>();
}
