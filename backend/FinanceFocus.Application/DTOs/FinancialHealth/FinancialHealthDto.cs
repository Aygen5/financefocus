using System;
using System.Collections.Generic;

namespace FinanceFocus.Application.DTOs.FinancialHealth;

public class FinancialHealthDto
{
    public int FinancialHealthScore { get; set; }
    public string RiskLevel { get; set; } = "Moderate";
    public ScoreBreakdownDto ScoreBreakdown { get; set; } = new();
    public IEnumerable<FinancialInsightDto> Insights { get; set; } = new List<FinancialInsightDto>();
    public DateTime CalculationDate { get; set; } = DateTime.UtcNow;
}
