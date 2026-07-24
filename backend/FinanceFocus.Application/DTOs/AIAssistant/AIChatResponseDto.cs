using System;

namespace FinanceFocus.Application.DTOs.AIAssistant;

public class AIChatResponseDto
{
    public string Answer { get; set; } = string.Empty;
    public string Category { get; set; } = "Finansal Analiz & Danışmanlık";
    public string ProviderUsed { get; set; } = "Ollama (Qwen 2.5)";
    public DateTime RespondedAt { get; set; } = DateTime.UtcNow;
}
