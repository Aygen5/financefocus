using FinanceFocus.Domain.Common;

namespace FinanceFocus.Domain.Entities;

public class ActivityLog : BaseEntity
{
    public string Action { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "info";
    public string UserId { get; set; } = string.Empty;
}
