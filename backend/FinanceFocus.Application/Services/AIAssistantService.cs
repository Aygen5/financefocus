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
                Category = "Finansal Asistan Bilgilendirme",
                ProviderUsed = "FinanceFocus AI Engine",
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
                            sb.AppendLine($"{rank}. 📌 **{cat.Category}:** **{cat.Amount:N2} TL** (Harcamaların %{pct:N1}'i){limitStr}{overWarning}");
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
                    sb.AppendLine($"• **Tasarruf Oranı:** **%{metrics.SavingsRate:N0}** (Aylık Net Akış: **{metrics.NetSavings:N2} TL**)");
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

            case AIIntentType.SubscriptionAnalysisQuestion:
            case AIIntentType.SubscriptionQuestion:
                {
                    if (metrics.ActiveSubscriptionCount == 0)
                    {
                        return "Henüz aktif bir abonelik kaydınız bulunmamaktadır. Abonelikler sayfasından ilk aboneliğinizi ekleyebilirsiniz.";
                    }

                    var sb = new StringBuilder();
                    sb.AppendLine("### 💳 Abonelik Harcama ve Maliyet Analizi\n");
                    sb.AppendLine($"• **Aktif Abonelik Sayısı:** **{metrics.ActiveSubscriptionCount} Adet**");
                    sb.AppendLine($"• **Toplam Aylık Maliyet:** **{metrics.TotalMonthlySubscriptionCost:N2} TL** (Aylık gelirinizin **%{metrics.SubscriptionToIncomePercentage:N1}**'i)");
                    sb.AppendLine($"• **En Yüksek Giderli Abonelik:** **{metrics.MostExpensiveSubscriptionName}** (**{metrics.MostExpensiveSubscriptionPrice:N2} TL/Ay**)");
                    return sb.ToString();
                }

            case AIIntentType.PortfolioAnalysisQuestion:
            case AIIntentType.PortfolioValueQuestion:
                {
                    if (metrics.TotalPortfolioValue == 0 && metrics.TotalPortfolioInvestment == 0)
                    {
                        return "Henüz portföyünüzde bir varlık kaydı bulunmamaktadır. Portföy sayfasından ilk hisse, altın veya kripto varlığınızı ekleyebilirsiniz.";
                    }

                    var sb = new StringBuilder();
                    sb.AppendLine("### 📈 Portföy ve Yatırım Durum Analizi\n");
                    sb.AppendLine($"• **Toplam Portföy Değeri:** **{metrics.TotalPortfolioValue:N2} TL**");
                    sb.AppendLine($"• **Toplam Yatırım Maliyeti:** **{metrics.TotalPortfolioInvestment:N2} TL**");
                    sb.AppendLine($"• **Net Kâr / Zarar:** **{metrics.TotalPortfolioProfitLoss:N2} TL** (%{metrics.TotalPortfolioProfitLossPercentage:N1})");
                    return sb.ToString();
                }

            case AIIntentType.RiskQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine("### 🛡️ Finansal Sağlık ve Risk Profili Analizi\n");
                    sb.AppendLine($"• **Finansal Sağlık Skoru:** **{metrics.FinancialHealthScore}/100**");
                    sb.AppendLine($"• **Backend Risk Seviyesi:** **{metrics.RiskLevel}**");
                    sb.AppendLine($"• **Gelir / Gider Oranı:** Geliriniz giderinizin **{metrics.IncomeToExpenseRatio:N1} katıdır** (Gelir: {metrics.MonthlyIncome:N2} TL, Gider: {metrics.MonthlyExpense:N2} TL)");
                    sb.AppendLine($"• **Tasarruf Oranı:** **%{metrics.SavingsRate:N0}**");
                    return sb.ToString();
                }

            case AIIntentType.IncomeQuestion:
                return $"Aylık geliriniz **{metrics.MonthlyIncome:N2} TL**'dir. (Aylık net tasarrufunuz: **{metrics.NetSavings:N2} TL**).";

            case AIIntentType.ExpenseQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"Aylık toplam gideriniz **{metrics.MonthlyExpense:N2} TL**'dir.");
                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory))
                    {
                        sb.AppendLine($"En çok harcama yapılan alan **{metrics.LargestSpendingCategory}** ({metrics.LargestSpendingAmount:N2} TL) olmuştur.");
                    }
                    return sb.ToString();
                }

            case AIIntentType.SavingsQuestion:
            case AIIntentType.SavingsRateQuestion:
                return $"Aylık net tasarrufunuz **{metrics.NetSavings:N2} TL** olup tasarruf oranınız **%{metrics.SavingsRate:N0}** seviyesindedir.";

            case AIIntentType.ExpenseComparisonQuestion:
                var isHigher = metrics.MonthlyIncome >= metrics.MonthlyExpense;
                var compPrefix = isHigher ? "Geliriniz giderinizden fazladır" : "Gideriniz gelirinizden fazladır";
                return $"{compPrefix}. Geliriniz giderinizin yaklaşık **{metrics.IncomeToExpenseRatio:N1} katıdır** (Aylık Gelir: **{metrics.MonthlyIncome:N2} TL**, Aylık Gider: **{metrics.MonthlyExpense:N2} TL**).";

            default:
                var defSb = new StringBuilder();
                defSb.AppendLine("### 📊 Genel Finansal Durum Özetiniz\n");
                defSb.AppendLine($"• **Aylık Gelir:** **{metrics.MonthlyIncome:N2} TL**");
                defSb.AppendLine($"• **Aylık Gider:** **{metrics.MonthlyExpense:N2} TL**");
                defSb.AppendLine($"• **Net Tasarruf:** **{metrics.NetSavings:N2} TL** (%{metrics.SavingsRate:N0})");
                defSb.AppendLine($"• **Finansal Sağlık Skoru:** **{metrics.FinancialHealthScore}/100** ({metrics.RiskLevel})");
                return defSb.ToString();
        }
    }

    private static bool TryGetFactResponse(AIIntentType intent, FinancialCoreMetricsDto metrics, out string factResponse)
    {
        factResponse = string.Empty;
        if (intent == AIIntentType.GeneralConversation)
        {
            factResponse = "Ben FinanceFocus finansal asistanıyım. Gelir, gider, bütçe, harcama dağılımı, abonelikler, tasarruf ve portföy gibi finansal konularda sorularınızı sorabilirsiniz.";
            return true;
        }
        return false;
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
