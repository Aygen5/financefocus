using System;

namespace FinanceFocus.Application.DTOs.Forecast;

public class ForecastSummaryDto
{
    public decimal EstimatedMonthlyIncome { get; set; }
    public decimal EstimatedMonthlyExpense { get; set; }
    public decimal EstimatedSavings { get; set; }
    public string BudgetRiskLevel { get; set; } = "Low";
    public DateTime? EstimatedGoalCompletionDate { get; set; }
    public decimal EstimatedPortfolioValue { get; set; }
}
