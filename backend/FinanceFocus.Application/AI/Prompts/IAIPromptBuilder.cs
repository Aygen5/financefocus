using System.Collections.Generic;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.FinancialEngine;

namespace FinanceFocus.Application.AI.Prompts;

public interface IAIPromptBuilder
{
    string BuildSystemPrompt();
    string BuildFullPrompt(string userPrompt, IEnumerable<AIChatMessageDto>? history, FinancialCoreMetricsDto metrics);
}
