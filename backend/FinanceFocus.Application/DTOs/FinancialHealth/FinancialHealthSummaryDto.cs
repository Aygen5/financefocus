using System.Collections.Generic;

namespace FinanceFocus.Application.DTOs.FinancialHealth;

public class FinancialHealthSummaryDto
{
    public int FinancialHealthScore { get; set; }
    public string RiskLevel { get; set; } = "Moderate";
    public IEnumerable<FinancialInsightDto> TopInsights { get; set; } = new List<FinancialInsightDto>();
}
