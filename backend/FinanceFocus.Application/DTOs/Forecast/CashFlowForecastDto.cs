namespace FinanceFocus.Application.DTOs.Forecast;

public class CashFlowForecastDto
{
    public decimal EstimatedMonthlyIncome { get; set; }
    public decimal EstimatedMonthlyExpense { get; set; }
    public decimal EstimatedMonthlySavings { get; set; }
    public string AlgorithmUsed { get; set; } = "WeightedMovingAverage";
}
