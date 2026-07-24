using System.Collections.Generic;
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
    string BuildSystemPromptWithContext(FinancialCoreMetricsDto metrics);
    List<OllamaChatMessage> BuildOllamaChatMessages(string userPrompt, IEnumerable<AIChatMessageDto>? history, FinancialCoreMetricsDto metrics);
    string BuildFullPrompt(string userPrompt, IEnumerable<AIChatMessageDto>? history, FinancialCoreMetricsDto metrics);
}
