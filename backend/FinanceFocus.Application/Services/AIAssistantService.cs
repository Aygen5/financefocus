using System;
using System.Collections.Generic;
using System.Linq;
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

    private static readonly string[] LeakageKeywords = new[]
    {
        "asla yeni sayi",
        "asla yeni sayı",
        "backend",
        "hesaplanmis guncel",
        "hesaplanmış güncel",
        "kurallar",
        "system",
        "prompt",
        "verilen metrikler",
        "guncel metrikler",
        "güncel metrikler"
    };

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

        chatResponse.Answer = SanitizeAndValidateResponse(chatResponse.Answer, metrics);

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
            case AIIntentType.IncomeQuestion:
                factResponse = $"Aylık geliriniz **{metrics.MonthlyIncome:N2} TL**'dir.";
                return true;

            case AIIntentType.ExpenseQuestion:
                factResponse = $"Aylık gideriniz **{metrics.MonthlyExpense:N2} TL**'dir.";
                return true;

            case AIIntentType.SavingsQuestion:
                factResponse = $"Net aylık tasarrufunuz **{metrics.NetSavings:N2} TL**'dir.";
                return true;

            case AIIntentType.ExpenseComparisonQuestion:
                factResponse = $"Aylık geliriniz ({metrics.MonthlyIncome:N0} TL), aylık giderinizin ({metrics.MonthlyExpense:N0} TL) **{metrics.IncomeToExpenseRatio:N1} katıdır**.";
                return true;

            case AIIntentType.SavingsRateQuestion:
                factResponse = $"Aylık tasarruf oranınız **%{metrics.SavingsRate:N0}** seviyesindedir (Finansal standartlarda %20 ve üzeri mükemmel kabul edilir).";
                return true;

            case AIIntentType.LargestExpenseQuestion:
                factResponse = $"Bu ay en çok harcama yaptığınız kategori **{metrics.LargestSpendingCategory}** kategorisidir (Harcama Tutarı: **{metrics.LargestSpendingAmount:N2} TL**).";
                return true;

            case AIIntentType.SubscriptionQuestion:
                factResponse = $"En yüksek tutarlı aktif aboneliğiniz **{metrics.MostExpensiveSubscriptionName}** aboneliğidir (Aylık Tutarı: **{metrics.MostExpensiveSubscriptionPrice:N2} TL**).";
                return true;

            case AIIntentType.SubscriptionAnalysisQuestion:
                factResponse = $"Toplam **{metrics.ActiveSubscriptionCount}** adet aktif aboneliğiniz bulunmakta olup aylık maliyeti **{metrics.TotalMonthlySubscriptionCost:N2} TL**'dir (Gelirinizin **%{metrics.SubscriptionToIncomePercentage:N1}**'i). En yüksek giderli aboneliğiniz **{metrics.MostExpensiveSubscriptionName}**'dir.";
                return true;

            case AIIntentType.PortfolioValueQuestion:
                factResponse = $"Toplam portföy değeriniz **{metrics.TotalPortfolioValue:N2} TL**'dir (Yatırım Tutarı: **{metrics.TotalPortfolioInvestment:N2} TL**, Net Kâr: **{metrics.TotalPortfolioProfitLoss:N2} TL** / **%{metrics.TotalPortfolioProfitLossPercentage:N1}**).";
                return true;

            case AIIntentType.GeneralConversation:
                factResponse = "Merhaba! Ben FinanceFocus Akıllı Finansal Asistanıyım. Geliriniz, giderleriniz, tasarruflarınız veya portföyünüz hakkında size nasıl yardımcı olabilirim?";
                return true;

            default:
                return false;
        }
    }

    private static string SanitizeAndValidateResponse(string rawAnswer, FinancialCoreMetricsDto metrics)
    {
        if (string.IsNullOrWhiteSpace(rawAnswer))
        {
            return $"Finansal sağlık skorunuz **{metrics.FinancialHealthScore}/100** ve risk seviyeniz **{metrics.RiskLevel}** olarak değerlendirilmiştir.";
        }

        var lower = rawAnswer.ToLowerInvariant();
        if (LeakageKeywords.Any(k => lower.Contains(k)))
        {
            return $"Finansal özetiniz: Aylık Tasarruf Oranınız **%{metrics.SavingsRate:N0}**, Portföy Değeriniz **{metrics.TotalPortfolioValue:N2} TL** ve Finansal Sağlık Skorunuz **{metrics.FinancialHealthScore}/100**'dür.";
        }

        var lines = rawAnswer.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
            .Select(l => l.Trim())
            .Distinct()
            .ToList();

        var sanitized = string.Join("\n\n", lines);
        return string.IsNullOrWhiteSpace(sanitized) ? rawAnswer : sanitized;
    }
}
