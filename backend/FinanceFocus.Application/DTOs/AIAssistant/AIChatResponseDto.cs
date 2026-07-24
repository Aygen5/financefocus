using System;

namespace FinanceFocus.Application.DTOs.AIAssistant;

public class AIChatResponseDto
{
    public string Answer { get; set; } = string.Empty;
    public string Category { get; set; } = "Genel Tavsiye";
    public string ProviderUsed { get; set; } = "RuleBasedAIProvider";
    public DateTime RespondedAt { get; set; } = DateTime.UtcNow;
}
