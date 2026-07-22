using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Notifications;

namespace FinanceFocus.Application.Interfaces;

public interface INotificationService
{
    Task<Result<IEnumerable<NotificationDto>>> GetUserNotificationsAsync(string userId);
    Task<Result> MarkAsReadAsync(string id, string userId);
    Task<Result> MarkAllAsReadAsync(string userId);
}
