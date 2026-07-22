using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Notifications;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class NotificationService : INotificationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public NotificationService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<NotificationDto>>> GetUserNotificationsAsync(string userId)
    {
        var notifications = await _unitOfWork.Notifications.GetByUserIdAsync(userId);
        var dtos = _mapper.Map<IEnumerable<NotificationDto>>(notifications);
        return Result<IEnumerable<NotificationDto>>.Success(dtos);
    }

    public async Task<Result> MarkAsReadAsync(string id, string userId)
    {
        var notification = await _unitOfWork.Notifications.GetByIdAsync(id);
        if (notification == null || notification.UserId != userId)
        {
            return Result.Failure("Bildirim bulunamadı.");
        }

        notification.IsRead = true;
        _unitOfWork.Notifications.Update(notification);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success("Bildirim okundu olarak işaretlendi.");
    }

    public async Task<Result> MarkAllAsReadAsync(string userId)
    {
        var unreadNotifications = await _unitOfWork.Notifications.GetUnreadByUserIdAsync(userId);
        foreach (var notification in unreadNotifications)
        {
            notification.IsRead = true;
            _unitOfWork.Notifications.Update(notification);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result.Success("Tüm bildirimler okundu olarak işaretlendi.");
    }
}
