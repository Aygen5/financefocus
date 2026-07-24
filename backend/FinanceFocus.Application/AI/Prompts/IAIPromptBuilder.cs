using System.Collections.Generic;
using FinanceFocus.Application.AI.Intent;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.FinancialEngine;

namespace FinanceFocus.Application.AI.Prompts;

public class OllamaChatMessage
{
    public string role { get; set; } = "user";
    public string content { get; set; } = string.Empty;
}

public interface IAIPromptBuilder
{
    string BuildSystemPromptWithContext(FinancialCoreMetricsDto metrics, AIIntentType intent);
    List<OllamaChatMessage> BuildOllamaChatMessages(string userPrompt, AIIntentType intent, IEnumerable<AIChatMessageDto>? history, FinancialCoreMetricsDto metrics);
    string BuildFullPrompt(string userPrompt, IEnumerable<AIChatMessageDto>? history, FinancialCoreMetricsDto metrics);
}
