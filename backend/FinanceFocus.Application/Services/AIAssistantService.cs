using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FinanceFocus.Application.AI.Intent;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.FinancialEngine;
using FinanceFocus.Application.Interfaces;

namespace FinanceFocus.Application.Services;

public class AIAssistantService : IAIAssistantService
{
    private readonly IFinancialEngineService _financialEngineService;
    private readonly IAIIntentClassifier _intentClassifier;
    private readonly IAIProvider _aiProvider;

    public AIAssistantService(
        IFinancialEngineService financialEngineService,
        IAIIntentClassifier intentClassifier,
        IAIProvider aiProvider)
    {
        _financialEngineService = financialEngineService;
        _intentClassifier = intentClassifier;
        _aiProvider = aiProvider;
    }

    public async Task<Result<AIChatResponseDto>> ProcessChatMessageAsync(string userId, AIChatRequestDto request)
    {
        var metricsResult = await _financialEngineService.CalculateCoreMetricsAsync(userId);
        var metrics = metricsResult.Data ?? new FinancialCoreMetricsDto();
        var intent = _intentClassifier.Classify(request.Prompt);

        if (TryGetFactResponse(intent, metrics, out var factAnswer))
        {
            return Result<AIChatResponseDto>.Success(new AIChatResponseDto
            {
                Answer = factAnswer,
                Category = "Doğrudan Finansal Veri (Fact Engine)",
                ProviderUsed = "FinancialEngineService (Fact Engine)",
                RespondedAt = DateTime.UtcNow
            });
        }

        var chatResponse = await _aiProvider.ProcessChatPromptAsync(
            userId,
            request.Prompt,
            intent,
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
        var intent = _intentClassifier.Classify(request.Prompt);

        if (TryGetFactResponse(intent, metrics, out var factAnswer))
        {
            yield return factAnswer;
            yield break;
        }

        await foreach (var token in _aiProvider.StreamChatPromptAsync(userId, request.Prompt, intent, request.History, metrics, cancellationToken))
        {
            yield return token;
        }
    }

    private static bool TryGetFactResponse(AIIntentType intent, FinancialCoreMetricsDto metrics, out string factResponse)
    {
        factResponse = string.Empty;
        switch (intent)
        {
            case AIIntentType.FactIncome:
                factResponse = $"Aylık geliriniz **{metrics.MonthlyIncome:N2} TL**'dir.";
                return true;

            case AIIntentType.FactExpense:
                factResponse = $"Aylık gideriniz **{metrics.MonthlyExpense:N2} TL**'dir.";
                return true;

            case AIIntentType.FactSavings:
                factResponse = $"Net aylık tasarrufunuz **{metrics.NetSavings:N2} TL**'dir (Tasarruf Oranınız: **%{metrics.SavingsRate:N0}**).";
                return true;

            case AIIntentType.FactPortfolio:
                factResponse = $"Toplam portföy değeriniz **{metrics.TotalPortfolioValue:N2} TL**'dir (Kâr/Zarar: **{metrics.TotalPortfolioProfitLoss:N2} TL**).";
                return true;

            case AIIntentType.FactSubscriptions:
                factResponse = $"Toplam aylık abonelik gideriniz **{metrics.TotalMonthlySubscriptionCost:N2} TL**'dir ({metrics.ActiveSubscriptionCount} adet aktif abonelik).";
                return true;

            case AIIntentType.FactTopCategory:
                factResponse = $"Bu ay en çok harcama yaptığınız kategori **{metrics.LargestSpendingCategory}** kategorisidir (Harcama Tutarı: **{metrics.LargestSpendingAmount:N2} TL**).";
                return true;

            case AIIntentType.FactTopSubscription:
                factResponse = $"En yüksek tutarlı aktif aboneliğiniz **{metrics.MostExpensiveSubscriptionName}** aboneliğidir (Aylık Tutarı: **{metrics.MostExpensiveSubscriptionPrice:N2} TL**).";
                return true;

            case AIIntentType.FactHealthScore:
                factResponse = $"Finansal sağlık skorunuz 100 üzerinden **{metrics.FinancialHealthScore}**'dir (Risk Seviyesi: {metrics.RiskLevel}).";
                return true;

            default:
                return false;
        }
    }
}
