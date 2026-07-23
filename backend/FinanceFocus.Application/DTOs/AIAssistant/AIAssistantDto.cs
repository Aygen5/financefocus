using System;
using System.Collections.Generic;

namespace FinanceFocus.Application.DTOs.AIAssistant;

public class AIAssistantDto
{
    public AIConversationSummaryDto Summary { get; set; } = new();
    public IEnumerable<AIAdviceDto> Advices { get; set; } = new List<AIAdviceDto>();
    public IEnumerable<AIAdviceDto> RiskAnalysis { get; set; } = new List<AIAdviceDto>();
    public IEnumerable<AIAdviceDto> Opportunities { get; set; } = new List<AIAdviceDto>();
    public string ProviderUsed { get; set; } = "RuleBasedAIProvider";
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}
