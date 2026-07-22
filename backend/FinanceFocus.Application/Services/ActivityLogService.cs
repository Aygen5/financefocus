using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.ActivityLogs;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class ActivityLogService : IActivityLogService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ActivityLogService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<ActivityLogDto>>> GetUserActivityLogsAsync(string userId)
    {
        var logs = await _unitOfWork.ActivityLogs.GetByUserIdAsync(userId);
        var dtos = _mapper.Map<IEnumerable<ActivityLogDto>>(logs);
        return Result<IEnumerable<ActivityLogDto>>.Success(dtos);
    }

    public async Task LogAsync(string userId, string action, string category, string description, string status = "info")
    {
        var log = new ActivityLog
        {
            UserId = userId,
            Action = action,
            Category = category,
            Description = description,
            Status = status
        };

        await _unitOfWork.ActivityLogs.AddAsync(log);
        await _unitOfWork.SaveChangesAsync();
    }
}
