using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.DTOs.Notifications;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Domain.UnitOfWork;
using Microsoft.Extensions.Logging;

namespace FinanceFocus.Application.Services;

public class BackgroundJobService : IBackgroundJobService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly ILogger<BackgroundJobService> _logger;

    public BackgroundJobService(
        IUnitOfWork unitOfWork,
        INotificationService notificationService,
        ILogger<BackgroundJobService> logger)
    {
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task ProcessSubscriptionRemindersAsync()
    {
        var stopwatch = Stopwatch.StartNew();
        _logger.LogInformation("Hangfire Job STARTED: ProcessSubscriptionReminders");

        try
        {
            var today = DateTime.UtcNow.Date;
            var upcomingDate = today.AddDays(7);

            var subscriptions = await _unitOfWork.Subscriptions.GetAllAsync();
            var upcoming = subscriptions
                .Where(s => s.IsActive && s.NextBillingDate.Date >= today && s.NextBillingDate.Date <= upcomingDate)
                .ToList();

            foreach (var sub in upcoming)
            {
                var dto = new CreateNotificationDto
                {
                    Title = "Yaklaşan Abonelik Ödemesi",
                    Message = $"{sub.Name} aboneliğinizin {sub.NextBillingDate:dd.MM.yyyy} tarihinde {sub.Price:N2} TL ödemesi bulunmaktadır.",
                    Type = NotificationType.Warning,
                    Category = "Subscriptions"
                };

                await _notificationService.CreateNotificationAsync(dto, sub.UserId);
            }

            stopwatch.Stop();
            _logger.LogInformation("Hangfire Job COMPLETED: ProcessSubscriptionReminders in {ElapsedMs}ms. Processed {Count} subscriptions.", 
                stopwatch.ElapsedMilliseconds, upcoming.Count);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, "Hangfire Job FAILED: ProcessSubscriptionReminders after {ElapsedMs}ms.", stopwatch.ElapsedMilliseconds);
            throw;
        }
    }

    public async Task ProcessGoalProgressRemindersAsync()
    {
        var stopwatch = Stopwatch.StartNew();
        _logger.LogInformation("Hangfire Job STARTED: ProcessGoalProgressReminders");

        try
        {
            var goals = await _unitOfWork.Goals.GetAllAsync();
            var completedGoals = goals.Where(g => g.CurrentAmount >= g.TargetAmount).ToList();

            foreach (var goal in completedGoals)
            {
                var dto = new CreateNotificationDto
                {
                    Title = "Tebrikler! Finansal Hedefe Ulaşıldı 🎉",
                    Message = $"Tebrikler! '{goal.Name}' hedefinize ({goal.TargetAmount:N2} TL) başarıyla ulaştınız.",
                    Type = NotificationType.Success,
                    Category = "Goals"
                };

                await _notificationService.CreateNotificationAsync(dto, goal.UserId);
            }

            stopwatch.Stop();
            _logger.LogInformation("Hangfire Job COMPLETED: ProcessGoalProgressReminders in {ElapsedMs}ms. Processed {Count} completed goals.", 
                stopwatch.ElapsedMilliseconds, completedGoals.Count);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, "Hangfire Job FAILED: ProcessGoalProgressReminders after {ElapsedMs}ms.", stopwatch.ElapsedMilliseconds);
            throw;
        }
    }
}
