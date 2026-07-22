using System;

namespace FinanceFocus.Application.DTOs.Goals;

public class GoalDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public DateTime Deadline { get; set; }
    public string Category { get; set; } = string.Empty;
    public double ProgressPercentage => TargetAmount > 0 ? Math.Min(100.0, (double)(CurrentAmount / TargetAmount * 100)) : 0.0;
    public string UserId { get; set; } = string.Empty;
}
