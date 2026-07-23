using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Notifications;

namespace FinanceFocus.Application.Interfaces;

public interface INotificationService
{
    Task<Result<IEnumerable<NotificationDto>>> GetUserNotificationsAsync(string userId);
    Task<Result<IEnumerable<NotificationDto>>> GetLatestNotificationsAsync(string userId, int count = 5);
    Task<Result<int>> GetUnreadCountAsync(string userId);
    Task<Result<NotificationSummaryDto>> GetNotificationSummaryAsync(string userId);
    Task<Result<NotificationDto>> CreateNotificationAsync(CreateNotificationDto dto, string userId);
    Task<Result<int>> GenerateSystemNotificationsAsync(string userId);
    Task<Result> MarkAsReadAsync(string id, string userId);
    Task<Result> MarkAllAsReadAsync(string userId);
    Task<Result> DeleteNotificationAsync(string id, string userId);
}
