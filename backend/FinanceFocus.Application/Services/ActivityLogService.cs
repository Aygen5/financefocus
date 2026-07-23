using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.ActivityLogs;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.UnitOfWork;
using FluentValidation;

namespace FinanceFocus.Application.Services;

public class ActivityLogService : IActivityLogService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateActivityLogDto> _createValidator;

    public ActivityLogService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IValidator<CreateActivityLogDto> createValidator)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _createValidator = createValidator;
    }

    public async Task<Result<IEnumerable<ActivityLogDto>>> GetUserActivityLogsAsync(string userId, string? category = null, string? activityType = null)
    {
        var logs = (await _unitOfWork.ActivityLogs.GetByUserIdAsync(userId)).AsEnumerable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            logs = logs.Where(l => string.Equals(l.Category, category, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(activityType))
        {
            logs = logs.Where(l => string.Equals(l.ActivityType, activityType, StringComparison.OrdinalIgnoreCase));
        }

        logs = logs.OrderByDescending(l => l.CreatedAt);
        var dtos = _mapper.Map<IEnumerable<ActivityLogDto>>(logs);
        return Result<IEnumerable<ActivityLogDto>>.Success(dtos);
    }

    public async Task<Result<IEnumerable<ActivityLogDto>>> GetLatestActivityLogsAsync(string userId, int count = 5)
    {
        var logs = (await _unitOfWork.ActivityLogs.GetByUserIdAsync(userId))
            .OrderByDescending(l => l.CreatedAt)
            .Take(count);
        var dtos = _mapper.Map<IEnumerable<ActivityLogDto>>(logs);
        return Result<IEnumerable<ActivityLogDto>>.Success(dtos);
    }

    public async Task<Result<ActivityLogSummaryDto>> GetActivityLogSummaryAsync(string userId)
    {
        var logs = (await _unitOfWork.ActivityLogs.GetByUserIdAsync(userId))
            .OrderByDescending(l => l.CreatedAt)
            .ToList();

        var categoryCounts = logs
            .GroupBy(l => l.Category)
            .ToDictionary(g => g.Key, g => g.Count());

        var latestDtos = _mapper.Map<IEnumerable<ActivityLogDto>>(logs.Take(5));

        var summary = new ActivityLogSummaryDto
        {
            TotalCount = logs.Count,
            CategoryCounts = categoryCounts,
            LatestActivities = latestDtos
        };

        return Result<ActivityLogSummaryDto>.Success(summary);
    }

    public async Task<Result<ActivityLogDto>> GetActivityLogByIdAsync(string id, string userId)
    {
        var log = await _unitOfWork.ActivityLogs.GetByIdAsync(id);
        if (log == null || log.UserId != userId)
        {
            return Result<ActivityLogDto>.Failure("Aktivite kaydı bulunamadı.");
        }

        var dto = _mapper.Map<ActivityLogDto>(log);
        return Result<ActivityLogDto>.Success(dto);
    }

    public async Task<Result<ActivityLogDto>> CreateActivityLogAsync(CreateActivityLogDto dto, string userId)
    {
        var validationResult = await _createValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            return Result<ActivityLogDto>.Failure("Doğrulama hatası oluştu.", errors);
        }

        var log = _mapper.Map<ActivityLog>(dto);
        log.UserId = userId;
        log.Action = dto.ActivityType;
        log.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.ActivityLogs.AddAsync(log);
        await _unitOfWork.SaveChangesAsync();

        var resultDto = _mapper.Map<ActivityLogDto>(log);
        return Result<ActivityLogDto>.Success(resultDto, "Aktivite kaydı başarıyla oluşturuldu.");
    }

    public async Task LogAsync(string userId, string activityType, string title, string category, string description, string status = "info")
    {
        var log = new ActivityLog
        {
            UserId = userId,
            ActivityType = activityType,
            Action = activityType,
            Title = title,
            Category = category,
            Description = description,
            Status = status,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.ActivityLogs.AddAsync(log);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<Result> DeleteActivityLogAsync(string id, string userId)
    {
        var log = await _unitOfWork.ActivityLogs.GetByIdAsync(id);
        if (log == null || log.UserId != userId)
        {
            return Result.Failure("Silinecek aktivite kaydı bulunamadı.");
        }

        _unitOfWork.ActivityLogs.Delete(log);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success("Aktivite kaydı silindi.");
    }
}
