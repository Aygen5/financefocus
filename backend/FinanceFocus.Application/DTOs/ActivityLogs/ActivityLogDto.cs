using System;

namespace FinanceFocus.Application.DTOs.ActivityLogs;

public class ActivityLogDto
{
    public string Id { get; set; } = string.Empty;
    public string ActivityType { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Status { get; set; } = "info";
    public DateTime CreatedAt { get; set; }
    public string UserId { get; set; } = string.Empty;
}
