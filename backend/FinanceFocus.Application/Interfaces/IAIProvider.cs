using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.FinancialEngine;

namespace FinanceFocus.Application.Interfaces;

public interface IAIProvider
{
    string ProviderName { get; }

    Task<AIChatResponseDto> ProcessChatPromptAsync(
        string userId,
        string prompt,
        IEnumerable<AIChatMessageDto>? history,
        FinancialCoreMetricsDto metrics);

    IAsyncEnumerable<string> StreamChatPromptAsync(
        string userId,
        string prompt,
        IEnumerable<AIChatMessageDto>? history,
        FinancialCoreMetricsDto metrics,
        CancellationToken cancellationToken = default);
}
