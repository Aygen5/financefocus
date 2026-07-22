using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.ActivityLogs;

namespace FinanceFocus.Application.Interfaces;

public interface IActivityLogService
{
    Task<Result<IEnumerable<ActivityLogDto>>> GetUserActivityLogsAsync(string userId);
    Task LogAsync(string userId, string action, string category, string description, string status = "info");
}
