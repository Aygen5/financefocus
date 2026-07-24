using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.FinancialEngine;
using FinanceFocus.Application.Interfaces;

namespace FinanceFocus.Application.Services;

public class AIAssistantService : IAIAssistantService
{
    private readonly IFinancialEngineService _financialEngineService;
    private readonly IAIProvider _aiProvider;

    public AIAssistantService(
        IFinancialEngineService financialEngineService,
        IAIProvider aiProvider)
    {
        _financialEngineService = financialEngineService;
        _aiProvider = aiProvider;
    }

    public async Task<Result<AIChatResponseDto>> ProcessChatMessageAsync(string userId, AIChatRequestDto request)
    {
        var metricsResult = await _financialEngineService.CalculateCoreMetricsAsync(userId);
        var metrics = metricsResult.Data ?? new FinancialCoreMetricsDto();

        var chatResponse = await _aiProvider.ProcessChatPromptAsync(
            userId,
            request.Prompt,
            request.History,
            metrics);

        return Result<AIChatResponseDto>.Success(chatResponse);
    }

    public async IAsyncEnumerable<string> StreamChatMessageAsync(
        string userId,
        AIChatRequestDto request,
        [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var metricsResult = await _financialEngineService.CalculateCoreMetricsAsync(userId);
        var metrics = metricsResult.Data ?? new FinancialCoreMetricsDto();

        await foreach (var token in _aiProvider.StreamChatPromptAsync(userId, request.Prompt, request.History, metrics, cancellationToken))
        {
            yield return token;
        }
    }
}
