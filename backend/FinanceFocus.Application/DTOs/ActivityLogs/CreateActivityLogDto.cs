namespace FinanceFocus.Application.DTOs.ActivityLogs;

public class CreateActivityLogDto
{
    public string ActivityType { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public string Status { get; set; } = "info";
}
