using System;

namespace FinanceFocus.Application.DTOs.Goals;

public class CreateGoalDto
{
    public string Name { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public DateTime Deadline { get; set; }
    public string Category { get; set; } = string.Empty;
}
