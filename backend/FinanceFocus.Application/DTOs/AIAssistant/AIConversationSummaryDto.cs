using System;

namespace FinanceFocus.Application.DTOs.AIAssistant;

public class AIConversationSummaryDto
{
    public string SummaryText { get; set; } = string.Empty;
    public int FinancialHealthScore { get; set; }
    public string RiskLevel { get; set; } = "Moderate";
    public string TopRecommendation { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}
