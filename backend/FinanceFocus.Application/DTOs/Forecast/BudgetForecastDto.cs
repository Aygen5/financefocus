using System;

namespace FinanceFocus.Application.DTOs.Forecast;

public class BudgetForecastDto
{
    public string Category { get; set; } = string.Empty;
    public decimal BudgetLimit { get; set; }
    public decimal CurrentSpentAmount { get; set; }
    public decimal DailySpendingRate { get; set; }
    public decimal ProjectedMonthEndExpense { get; set; }
    public DateTime? EstimatedDepletionDate { get; set; }
    public decimal ExceedProbabilityPercentage { get; set; }
    public string RiskLevel { get; set; } = "Low";
}
