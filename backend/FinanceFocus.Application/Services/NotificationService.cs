using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Notifications;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Domain.UnitOfWork;
using FluentValidation;

namespace FinanceFocus.Application.Services;

public class NotificationService : INotificationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateNotificationDto> _createValidator;

    public NotificationService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IValidator<CreateNotificationDto> createValidator)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _createValidator = createValidator;
    }

    public async Task<Result<IEnumerable<NotificationDto>>> GetUserNotificationsAsync(string userId)
    {
        var notifications = (await _unitOfWork.Notifications.GetByUserIdAsync(userId))
            .OrderByDescending(n => n.CreatedAt);
        var dtos = _mapper.Map<IEnumerable<NotificationDto>>(notifications);
        return Result<IEnumerable<NotificationDto>>.Success(dtos);
    }

    public async Task<Result<IEnumerable<NotificationDto>>> GetLatestNotificationsAsync(string userId, int count = 5)
    {
        var notifications = (await _unitOfWork.Notifications.GetByUserIdAsync(userId))
            .OrderByDescending(n => n.CreatedAt)
            .Take(count);
        var dtos = _mapper.Map<IEnumerable<NotificationDto>>(notifications);
        return Result<IEnumerable<NotificationDto>>.Success(dtos);
    }

    public async Task<Result<int>> GetUnreadCountAsync(string userId)
    {
        var count = (await _unitOfWork.Notifications.GetByUserIdAsync(userId))
            .Count(n => !n.IsRead);
        return Result<int>.Success(count);
    }

    public async Task<Result<NotificationSummaryDto>> GetNotificationSummaryAsync(string userId)
    {
        var notifications = (await _unitOfWork.Notifications.GetByUserIdAsync(userId))
            .OrderByDescending(n => n.CreatedAt)
            .ToList();

        var unreadCount = notifications.Count(n => !n.IsRead);
        var latestDtos = _mapper.Map<IEnumerable<NotificationDto>>(notifications.Take(5));

        var summary = new NotificationSummaryDto
        {
            UnreadCount = unreadCount,
            TotalCount = notifications.Count,
            LatestNotifications = latestDtos
        };

        return Result<NotificationSummaryDto>.Success(summary);
    }

    public async Task<Result<NotificationDto>> CreateNotificationAsync(CreateNotificationDto dto, string userId)
    {
        var validationResult = await _createValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            return Result<NotificationDto>.Failure("Doğrulama hatası oluştu.", errors);
        }

        var notification = _mapper.Map<Notification>(dto);
        notification.UserId = userId;
        notification.IsRead = false;
        notification.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.Notifications.AddAsync(notification);
        await _unitOfWork.SaveChangesAsync();

        var resultDto = _mapper.Map<NotificationDto>(notification);
        return Result<NotificationDto>.Success(resultDto, "Bildirim başarıyla oluşturuldu.");
    }

    public async Task<Result<int>> GenerateSystemNotificationsAsync(string userId)
    {
        int generatedCount = 0;
        var existingNotifications = (await _unitOfWork.Notifications.GetByUserIdAsync(userId)).ToList();

        var budgets = (await _unitOfWork.Budgets.GetByUserIdAsync(userId)).ToList();
        var transactions = (await _unitOfWork.Transactions.GetByUserIdAsync(userId)).ToList();

        foreach (var budget in budgets)
        {
            var spent = transactions
                .Where(t => t.TransactionType == TransactionType.Expense &&
                            string.Equals(t.Category, budget.Category, StringComparison.OrdinalIgnoreCase) &&
                            t.TransactionDate.Year == budget.Month.Year &&
                            t.TransactionDate.Month == budget.Month.Month)
                .Sum(t => t.Amount);

            if (budget.Limit > 0 && spent >= (budget.Limit * 0.9m))
            {
                var title = $"Bütçe Uyarısı: {budget.Category}";
                var alreadyNotified = existingNotifications.Any(n => n.Title == title && n.CreatedAt.Date == DateTime.UtcNow.Date);

                if (!alreadyNotified)
                {
                    var notification = new Notification
                    {
                        Title = title,
                        Message = $"{budget.Category} kategorisindeki {budget.Limit:N2} TL bütçenizin {spent:N2} TL kadarı (%{(spent / budget.Limit * 100):N0}) harcandı!",
                        Type = spent >= budget.Limit ? NotificationType.Error : NotificationType.Warning,
                        Category = "BudgetAlert",
                        UserId = userId,
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _unitOfWork.Notifications.AddAsync(notification);
                    generatedCount++;
                }
            }
        }

        var goals = (await _unitOfWork.Goals.GetByUserIdAsync(userId)).ToList();
        foreach (var goal in goals)
        {
            if (goal.TargetAmount > 0 && goal.CurrentAmount >= goal.TargetAmount)
            {
                var title = $"Tebrikler: {goal.Name}";
                var alreadyNotified = existingNotifications.Any(n => n.Title == title);

                if (!alreadyNotified)
                {
                    var notification = new Notification
                    {
                        Title = title,
                        Message = $"Tebrikler! {goal.Name} adlı finansal hedefinize başarıyla ulaştınız.",
                        Type = NotificationType.Success,
                        Category = "GoalAchieved",
                        UserId = userId,
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _unitOfWork.Notifications.AddAsync(notification);
                    generatedCount++;
                }
            }
        }

        var subscriptions = (await _unitOfWork.Subscriptions.GetByUserIdAsync(userId))
            .Where(s => s.IsActive).ToList();

        var today = DateTime.UtcNow.Date;
        var nextWeek = today.AddDays(7);

        foreach (var sub in subscriptions)
        {
            if (sub.NextBillingDate.Date >= today && sub.NextBillingDate.Date <= nextWeek)
            {
                var title = $"Ödeme Anımsatıcısı: {sub.Name}";
                var alreadyNotified = existingNotifications.Any(n => n.Title == title && n.CreatedAt.Date == DateTime.UtcNow.Date);

                if (!alreadyNotified)
                {
                    var notification = new Notification
                    {
                        Title = title,
                        Message = $"{sub.Name} aboneliğinizin {sub.NextBillingDate:dd.MM.yyyy} tarihinde {sub.Price:N2} TL tutarında son ödeme günü yaklaşıyor.",
                        Type = NotificationType.Info,
                        Category = "SubscriptionRenewal",
                        UserId = userId,
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _unitOfWork.Notifications.AddAsync(notification);
                    generatedCount++;
                }
            }
        }

        if (generatedCount > 0)
        {
            await _unitOfWork.SaveChangesAsync();
        }

        return Result<int>.Success(generatedCount, $"{generatedCount} adet sistem bildirimi üretildi.");
    }

    public async Task<Result> MarkAsReadAsync(string id, string userId)
    {
        var notification = await _unitOfWork.Notifications.GetByIdAsync(id);
        if (notification == null || notification.UserId != userId)
        {
            return Result.Failure("Bildirim bulunamadı.");
        }

        notification.IsRead = true;
        notification.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Notifications.Update(notification);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success("Bildirim okundu olarak işaretlendi.");
    }

    public async Task<Result> MarkAllAsReadAsync(string userId)
    {
        var notifications = (await _unitOfWork.Notifications.GetByUserIdAsync(userId))
            .Where(n => !n.IsRead)
            .ToList();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.UpdatedAt = DateTime.UtcNow;
            _unitOfWork.Notifications.Update(notification);
        }

        if (notifications.Any())
        {
            await _unitOfWork.SaveChangesAsync();
        }

        return Result.Success("Tüm bildirimler okundu olarak işaretlendi.");
    }

    public async Task<Result> DeleteNotificationAsync(string id, string userId)
    {
        var notification = await _unitOfWork.Notifications.GetByIdAsync(id);
        if (notification == null || notification.UserId != userId)
        {
            return Result.Failure("Silinecek bildirim bulunamadı.");
        }

        _unitOfWork.Notifications.Delete(notification);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success("Bildirim silindi.");
    }
}
