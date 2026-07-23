using System;

namespace FinanceFocus.Application.DTOs.Forecast;

public class GoalForecastDto
{
    public string GoalId { get; set; } = string.Empty;
    public string GoalName { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public decimal RemainingAmount { get; set; }
    public decimal MonthlySavingsContribution { get; set; }
    public DateTime? EstimatedCompletionDate { get; set; }
    public int EstimatedMonthsRemaining { get; set; }
    public string Recommendation { get; set; } = string.Empty;
}
