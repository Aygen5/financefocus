using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.ActivityLogs;

namespace FinanceFocus.Application.Interfaces;

public interface IActivityLogService
{
    Task<Result<IEnumerable<ActivityLogDto>>> GetUserActivityLogsAsync(string userId, string? category = null, string? activityType = null);
    Task<Result<IEnumerable<ActivityLogDto>>> GetLatestActivityLogsAsync(string userId, int count = 5);
    Task<Result<ActivityLogSummaryDto>> GetActivityLogSummaryAsync(string userId);
    Task<Result<ActivityLogDto>> GetActivityLogByIdAsync(string id, string userId);
    Task<Result<ActivityLogDto>> CreateActivityLogAsync(CreateActivityLogDto dto, string userId);
    Task LogAsync(string userId, string activityType, string title, string category, string description, string status = "info");
    Task<Result> DeleteActivityLogAsync(string id, string userId);
}
