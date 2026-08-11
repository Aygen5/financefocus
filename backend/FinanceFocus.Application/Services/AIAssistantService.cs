using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
            var fallbackAnswer = GenerateDynamicAdvisorResponse(intent, metrics);
            return Result<AIChatResponseDto>.Success(new AIChatResponseDto
            {
                Answer = fallbackAnswer,
                Category = "Akıllı Finansal Analiz (FinanceFocus Engine)",
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
            yield return GenerateDynamicAdvisorResponse(intent, metrics);
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
                yield return GenerateDynamicAdvisorResponse(intent, metrics);
                yield break;
            }

            if (!hasNext) break;

            yield return enumerator.Current;
        }
    }

    private static string GenerateDynamicAdvisorResponse(AIIntentType intent, FinancialCoreMetricsDto metrics)
    {
        bool hasNoData = metrics.MonthlyIncome == 0 && metrics.MonthlyExpense == 0 && metrics.TotalPortfolioValue == 0 && metrics.ActiveSubscriptionCount == 0;
        if (hasNoData)
        {
            return "Henüz finansal veriniz (gelir/gider/bütçe) eklenmemiş görünüyor. İlk gelir ve gider harcamalarınızı ekleyerek kişiselleştirilmiş finansal analizler alabilirsiniz.";
        }

        switch (intent)
        {
            case AIIntentType.SpendingAnalysisQuestion:
                {
                    if (metrics.MonthlyExpense == 0)
                    {
                        return "Bu ay henüz kayıtlı bir harcamanız bulunmamaktadır.";
                    }

                    var sb = new StringBuilder();
                    sb.AppendLine("### 💸 Harcama Dağılımı ve Kategori Analizi\n");
                    sb.AppendLine($"Bu ay toplam **{metrics.MonthlyExpense:N2} TL** tutarında harcama gerçekleştirdiniz.");

                    if (metrics.CategoryExpenses != null && metrics.CategoryExpenses.Any())
                    {
                        sb.AppendLine("\n**Kategorilere Göre Harcama Dağılımı:**");
                        int rank = 1;
                        foreach (var cat in metrics.CategoryExpenses.OrderByDescending(c => c.Amount).Take(5))
                        {
                            var pct = metrics.MonthlyExpense > 0 ? (cat.Amount / metrics.MonthlyExpense) * 100m : 0m;
                            var limitStr = cat.Limit > 0 ? $" (Bütçe Limiti: {cat.Limit:N2} TL)" : string.Empty;
                            var overWarning = cat.Limit > 0 && cat.Amount > cat.Limit ? " ⚠️ **[Bütçe Aşıldı]**" : string.Empty;
                            sb.AppendLine($"{rank}. **{cat.Category}:** **{cat.Amount:N2} TL** (Harcamaların %{pct:N1}'i){limitStr}{overWarning}");
                            rank++;
                        }
                    }

                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory))
                    {
                        sb.AppendLine($"\n💡 **Özet:** En yüksek harcamanız **{metrics.LargestSpendingCategory}** ({metrics.LargestSpendingAmount:N2} TL) kategorisinde gerçekleşmiştir.");
                    }

                    return sb.ToString();
                }

            case AIIntentType.SavingsAdviceQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine("### 💡 Kişiselleştirilmiş Tasarruf Önerileri\n");
                    sb.AppendLine($"• **Net Aylık Tasarrufunuz:** **{metrics.NetSavings:N2} TL** (Tasarruf Oranı: **%{metrics.SavingsRate:N0}**)");
                    sb.AppendLine($"• **Finansal Sağlık Skoru:** **{metrics.FinancialHealthScore}/100** ({metrics.RiskLevel} Risk Grubu)\n");
                    sb.AppendLine("**Somut Tasarruf Adımları:**");

                    if (metrics.SavingsRate < 20m)
                    {
                        var targetSavings = metrics.MonthlyIncome * 0.20m;
                        var neededExtra = targetSavings - metrics.NetSavings;
                        sb.AppendLine($"1. 🎯 **Tasarruf Hedefi:** Mevcut tasarruf oranınız (%{metrics.SavingsRate:N0}) ideal %20 hedefinin altında. Aylık **{neededExtra:N2} TL** ek tasarruf ile ideal %20 tasarruf oranına ulaşabilirsiniz.");
                    }
                    else
                    {
                        sb.AppendLine("1. 🎯 **Tasarruf Başarısı:** Tasarruf oranınız %20 hedefinin üzerinde! Biriken birikimlerinizi yatırımlarda değerlendirebilirsiniz.");
                    }

                    if (metrics.ActiveSubscriptionCount > 0)
                    {
                        sb.AppendLine($"2. 💳 **Abonelik Kontrolü:** Aktif {metrics.ActiveSubscriptionCount} aboneliğinize aylık **{metrics.TotalMonthlySubscriptionCost:N2} TL** ödemektesiniz. En yüksek tutarlı **{metrics.MostExpensiveSubscriptionName} ({metrics.MostExpensiveSubscriptionPrice:N2} TL)** aboneliğinizi inceleyerek tasarruf sağlayabilirsiniz.");
                    }

                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory))
                    {
                        sb.AppendLine($"3. 🛍️ **Kategori İncelemesi:** En yüksek harcama alanınız olan **{metrics.LargestSpendingCategory}** ({metrics.LargestSpendingAmount:N2} TL) harcamalarınızda %10 kısıntı yaparak aylık **{(metrics.LargestSpendingAmount * 0.10m):N2} TL** biriktirebilirsiniz.");
                    }

                    return sb.ToString();
                }

            case AIIntentType.BudgetAdviceQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine("### 📊 Kişiselleştirilmiş Bütçe İyileştirme Analizi\n");
                    sb.AppendLine($"• **Finansal Sağlık Skoru:** **{metrics.FinancialHealthScore}/100** ({metrics.RiskLevel} Risk Grubu)");
                    sb.AppendLine($"• **Aylık Gelir / Gider:** Gelir: **{metrics.MonthlyIncome:N2} TL** | Gider: **{metrics.MonthlyExpense:N2} TL**");
                    sb.AppendLine($"• **Bütçe Aşımı Olan Kategori:** **{metrics.OverBudgetCategoryCount}** adet\n");

                    sb.AppendLine("**Stratejik Bütçe Tavsiyeleri:**");
                    if (metrics.OverBudgetCategoryCount > 0)
                    {
                        sb.AppendLine($"1. ⚠️ **Bütçe Aşımı:** {metrics.OverBudgetCategoryCount} kategoride belirlenen bütçe limitleri aşılmıştır. İlgili kategorilerdeki harcama limitlerini gözden geçirmeniz önerilir.");
                    }
                    else
                    {
                        sb.AppendLine("1. ✅ **Bütçe Disiplini:** Tüm kategorilerde bütçe limitlerinize uyuyorsunuz.");
                    }

                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory))
                    {
                        sb.AppendLine($"2. 🔍 **En Büyük Harcama:** En çok harcama yapılan **{metrics.LargestSpendingCategory}** ({metrics.LargestSpendingAmount:N2} TL) alanında limit tanımlayarak bütçenizi koruyabilirsiniz.");
                    }

                    return sb.ToString();
                }

            case AIIntentType.PortfolioAnalysisQuestion:
                return $"Portföyünüzün toplam güncel değeri **{metrics.TotalPortfolioValue:N2} TL** seviyesindedir. Toplam yatırım maliyetiniz **{metrics.TotalPortfolioInvestment:N2} TL** olup net kâr/zarar durumunuz **{metrics.TotalPortfolioProfitLoss:N2} TL** (%{metrics.TotalPortfolioProfitLossPercentage:N1}) olarak hesaplanmıştır.";

            case AIIntentType.RiskQuestion:
                return $"Finansal sağlık skorunuz **{metrics.FinancialHealthScore}/100** olarak hesaplanmıştır. Risk profili: **{metrics.RiskLevel}**. Aylık gelirinizin giderinize oranı **{metrics.IncomeToExpenseRatio:N1} kat**'tır.";

            default:
                return $"Finansal Özetiniz: Aylık Gelir **{metrics.MonthlyIncome:N2} TL**, Aylık Gider **{metrics.MonthlyExpense:N2} TL**, Net Tasarruf **{metrics.NetSavings:N2} TL** (%{metrics.SavingsRate:N0}) ve Finansal Sağlık Skoru **{metrics.FinancialHealthScore}/100**'dür.";
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
