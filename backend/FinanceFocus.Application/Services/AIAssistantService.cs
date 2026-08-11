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

        try
        {
            var chatResponse = await _aiProvider.ProcessChatPromptAsync(
                userId,
                request.Prompt,
                intent,
                request.History,
                metrics);

            chatResponse.Answer = SanitizeAndValidateResponse(chatResponse.Answer, metrics);

            return Result<AIChatResponseDto>.Success(chatResponse);
        }
        catch (FinanceFocus.Application.Services.Providers.OllamaUnavailableException)
        {
            var fallbackAnswer = GenerateFallbackAdvisorResponse(intent, metrics);
            return Result<AIChatResponseDto>.Success(new AIChatResponseDto
            {
                Answer = fallbackAnswer,
                Category = "Akıllı Finansal Analiz (Fact Engine)",
                ProviderUsed = "FinanceFocus AI Engine (Cloud Advisor)",
                RespondedAt = DateTime.UtcNow
            });
        }
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

        bool isOllamaUnavailable = false;
        IAsyncEnumerator<string>? enumerator = null;

        try
        {
            enumerator = _aiProvider.StreamChatPromptAsync(userId, request.Prompt, intent, request.History, metrics, cancellationToken).GetAsyncEnumerator(cancellationToken);
        }
        catch (FinanceFocus.Application.Services.Providers.OllamaUnavailableException)
        {
            isOllamaUnavailable = true;
        }

        if (isOllamaUnavailable)
        {
            yield return GenerateFallbackAdvisorResponse(intent, metrics);
            yield break;
        }

        while (enumerator != null)
        {
            bool hasNext = false;
            try
            {
                hasNext = await enumerator.MoveNextAsync();
            }
            catch (FinanceFocus.Application.Services.Providers.OllamaUnavailableException)
            {
                isOllamaUnavailable = true;
            }

            if (isOllamaUnavailable)
            {
                yield return GenerateFallbackAdvisorResponse(intent, metrics);
                yield break;
            }

            if (!hasNext) break;

            yield return enumerator.Current;
        }
    }

    private static string GenerateFallbackAdvisorResponse(AIIntentType intent, FinancialCoreMetricsDto metrics)
    {
        bool hasNoData = metrics.MonthlyIncome == 0 && metrics.MonthlyExpense == 0 && metrics.TotalPortfolioValue == 0;
        if (hasNoData)
        {
            return "Henüz finansal veriniz (gelir/gider) eklenmemiş görünüyor. İlk gelir ve gider işlemlerinizi ekleyerek kişiselleştirilmiş bütçe tavsiyeleri alabilirsiniz.";
        }

        switch (intent)
        {
            case AIIntentType.BudgetAdviceQuestion:
                var adviceBuilder = new System.Text.StringBuilder();
                adviceBuilder.AppendLine("### 📊 Kişiselleştirilmiş Bütçe İyileştirme Analizi\n");
                adviceBuilder.AppendLine($"• **Finansal Sağlık Skorunuz:** {metrics.FinancialHealthScore}/100 ({metrics.RiskLevel} Risk Grubu)");
                adviceBuilder.AppendLine($"• **Aylık Net Tasarrufunuz:** **{metrics.NetSavings:N2} TL** (Tasarruf Oranı: **%{metrics.SavingsRate:N0}**)");
                adviceBuilder.AppendLine();
                adviceBuilder.AppendLine("**Stratejik Tavsiyeler:**");
                if (metrics.SavingsRate < 20m)
                {
                    adviceBuilder.AppendLine("1. **Tasarruf Oranını Artırın:** Mevcut tasarruf oranınız %20 hedefinin altında. Gelirinizin en az %20'sini tasarrufa ayırmayı hedefleyin.");
                }
                else
                {
                    adviceBuilder.AppendLine("1. **Tasarruf Performansı:** Tasarruf oranınız mükemmel! Biriken tutarı yatırım araçlarında değerlendirebilirsiniz.");
                }
                if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory))
                {
                    adviceBuilder.AppendLine($"2. **En Yüksek Harcama:** En çok harcama yapılan **{metrics.LargestSpendingCategory}** ({metrics.LargestSpendingAmount:N2} TL) kategorisinde esnek giderleri gözden geçirin.");
                }
                if (metrics.ActiveSubscriptionCount > 0)
                {
                    adviceBuilder.AppendLine($"3. **Abonelik Kontrolü:** Toplam {metrics.ActiveSubscriptionCount} adet aktif aboneliğiniz (Aylık {metrics.TotalMonthlySubscriptionCost:N2} TL) bulunuyor. Az kullanılan abonelikleri iptal etmeyi değerlendirebilirsiniz.");
                }
                return adviceBuilder.ToString();

            case AIIntentType.PortfolioAnalysisQuestion:
                return $"Portföyünüzün toplam değeri **{metrics.TotalPortfolioValue:N2} TL** seviyesindedir. Toplam yatırım tutarınız **{metrics.TotalPortfolioInvestment:N2} TL** olup net kâr/zarar durumunuz **{metrics.TotalPortfolioProfitLoss:N2} TL** (%{metrics.TotalPortfolioProfitLossPercentage:N1}) olarak hesaplanmıştır.";

            case AIIntentType.RiskQuestion:
                return $"Finansal sağlık skorunuz **{metrics.FinancialHealthScore}/100** olarak hesaplanmıştır. Risk profili: **{metrics.RiskLevel}**. Aylık gelirinizin giderinize oranı **{metrics.IncomeToExpenseRatio:N1} kat**'tır.";

            default:
                return $"Finansal Durum Özetiniz: Aylık Tasarruf Oranınız **%{metrics.SavingsRate:N0}**, Net Tasarrufunuz **{metrics.NetSavings:N2} TL** ve Finansal Sağlık Skorunuz **{metrics.FinancialHealthScore}/100**'dür.";
        }
    }

    private static bool TryGetFactResponse(AIIntentType intent, FinancialCoreMetricsDto metrics, out string factResponse)
    {
        factResponse = string.Empty;
        bool hasNoData = metrics.MonthlyIncome == 0 && metrics.MonthlyExpense == 0 && metrics.TotalPortfolioValue == 0 && metrics.ActiveSubscriptionCount == 0;
        switch (intent)
        {
            case AIIntentType.IncomeQuestion:
                factResponse = metrics.MonthlyIncome > 0
                    ? $"Aylık geliriniz **{metrics.MonthlyIncome:N2} TL**'dir."
                    : "Henüz gelir kaydınız bulunmamaktadır. İlk gelirinizi ekleyerek başlayabilirsiniz.";
                return true;

            case AIIntentType.ExpenseQuestion:
                factResponse = metrics.MonthlyExpense > 0
                    ? $"Aylık gideriniz **{metrics.MonthlyExpense:N2} TL**'dir."
                    : "Henüz gider kaydınız bulunmamaktadır. İlk giderinizi ekleyerek başlayabilirsiniz.";
                return true;

            case AIIntentType.SavingsQuestion:
                factResponse = !hasNoData
                    ? $"Net aylık tasarrufunuz **{metrics.NetSavings:N2} TL**'dir."
                    : "Henüz gelir ve gider kaydınız bulunmadığı için tasarruf hesabı yapılamamaktadır.";
                return true;

            case AIIntentType.ExpenseComparisonQuestion:
                if (hasNoData)
                {
                    factResponse = "Henüz gelir ve gider kaydınız bulunmamaktadır.";
                    return true;
                }
                var isHigher = metrics.MonthlyIncome >= metrics.MonthlyExpense;
                var compPrefix = isHigher ? "Evet, geliriniz giderinizden" : "Hayır, geliriniz giderinizden azdır ve";
                factResponse = $"{compPrefix} yaklaşık **{metrics.IncomeToExpenseRatio:N1} kat** daha fazladır (Gelir: {metrics.MonthlyIncome:N0} TL, Gider: {metrics.MonthlyExpense:N0} TL).";
                return true;

            case AIIntentType.SavingsRateQuestion:
                if (metrics.MonthlyIncome == 0)
                {
                    factResponse = "Henüz gelir kaydınız bulunmadığı için tasarruf oranı hesaplanamamaktadır.";
                    return true;
                }
                var isGood = metrics.SavingsRate >= 20m;
                var evalText = isGood ? "mükemmel bir seviyededir" : "geliştirilmeye açık bir seviyededir";
                factResponse = $"Evet, %{metrics.SavingsRate:N0} tasarruf oranınız {evalText} (Finansal standartlarda %20 ve üzeri başarılı kabul edilir).";
                return true;

            case AIIntentType.LargestExpenseQuestion:
                if (metrics.MonthlyExpense == 0)
                {
                    factResponse = "Henüz harcama kaydınız bulunmamaktadır.";
                    return true;
                }
                var hasOverBudget = metrics.OverBudgetCategoryCount > 0;
                var overText = hasOverBudget ? "Evet, bütçe aşımınız bulunmaktadır." : "Hayır, bütçenizi aşmadınız.";
                factResponse = $"{overText} Bu ay en yüksek harcamanız **{metrics.LargestSpendingCategory}** kategorisindedir (Harcama Tutarı: **{metrics.LargestSpendingAmount:N2} TL**).";
                return true;

            case AIIntentType.SubscriptionQuestion:
                if (metrics.ActiveSubscriptionCount == 0)
                {
                    factResponse = "Henüz aktif bir aboneliğiniz bulunmamaktadır.";
                    return true;
                }
                factResponse = $"En yüksek tutarlı aktif aboneliğiniz **{metrics.MostExpensiveSubscriptionName}** aboneliğidir (Aylık Tutarı: **{metrics.MostExpensiveSubscriptionPrice:N2} TL**).";
                return true;

            case AIIntentType.SubscriptionAnalysisQuestion:
                if (metrics.ActiveSubscriptionCount == 0)
                {
                    factResponse = "Henüz aktif bir aboneliğiniz bulunmamaktadır.";
                    return true;
                }
                factResponse = $"Toplam **{metrics.ActiveSubscriptionCount}** adet aktif aboneliğiniz bulunmakta olup aylık maliyeti **{metrics.TotalMonthlySubscriptionCost:N2} TL**'dir (Gelirinizin **%{metrics.SubscriptionToIncomePercentage:N1}**'i). En yüksek giderli aboneliğiniz **{metrics.MostExpensiveSubscriptionName}**'dir.";
                return true;

            case AIIntentType.PortfolioValueQuestion:
                if (metrics.TotalPortfolioValue == 0 && metrics.TotalPortfolioInvestment == 0)
                {
                    factResponse = "Henüz portföy yatırım kaydınız bulunmamaktadır.";
                    return true;
                }
                factResponse = $"Toplam portföy değeriniz **{metrics.TotalPortfolioValue:N2} TL**'dir (Yatırım Tutarı: **{metrics.TotalPortfolioInvestment:N2} TL**, Net Kâr: **{metrics.TotalPortfolioProfitLoss:N2} TL** / **%{metrics.TotalPortfolioProfitLossPercentage:N1}**).";
                return true;

            case AIIntentType.GeneralConversation:
                factResponse = "Ben FinanceFocus finansal asistanıyım. Sadece gelir, gider, bütçe, abonelikler, tasarruf ve portföy gibi finansal konularda yardımcı olabilirim.";
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
