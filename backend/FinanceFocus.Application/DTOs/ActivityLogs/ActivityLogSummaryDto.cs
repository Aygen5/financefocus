using System.Collections.Generic;

namespace FinanceFocus.Application.DTOs.ActivityLogs;

public class ActivityLogSummaryDto
{
    public int TotalCount { get; set; }
    public Dictionary<string, int> CategoryCounts { get; set; } = new();
    public IEnumerable<ActivityLogDto> LatestActivities { get; set; } = new List<ActivityLogDto>();
}
