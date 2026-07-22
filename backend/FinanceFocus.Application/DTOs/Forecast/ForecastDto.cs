using System;

namespace FinanceFocus.Application.DTOs.Forecast;

public class ForecastDto
{
    public DateTime ForecastDate { get; set; }
    public decimal ProjectedIncome { get; set; }
    public decimal ProjectedExpense { get; set; }
    public decimal ProjectedSavings { get; set; }
    public string AlgorithmUsed { get; set; } = "SMA";
}
