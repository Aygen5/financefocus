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
            return "Henüz FinanceFocus hesabınızda herhangi bir gelir, gider, abonelik veya bütçe kaydı bulunmamaktadır. İşlemler sayfasından ilk gelir ve gider harcamalarınızı ekleyerek kişiselleştirilmiş finansal analizler alabilirsiniz.";
        }

        switch (intent)
        {
            case AIIntentType.SpendingAnalysisQuestion:
                {
                    if (metrics.MonthlyExpense == 0)
                    {
                        return "Bu ay henüz kayıtlı bir harcamanız bulunmamaktadır. Harcama eklediğinizde detaylı analizlerinizi burada görebilirsiniz.";
                    }

                    var sb = new StringBuilder();
                    sb.AppendLine($"Bu ay toplam **{metrics.MonthlyExpense:N2} TL** harcama yaptınız.");

                    if (metrics.CategoryExpenses != null && metrics.CategoryExpenses.Any())
                    {
                        var topList = metrics.CategoryExpenses.OrderByDescending(c => c.Amount).Take(3).ToList();
                        if (topList.Count > 0)
                        {
                            var top1 = topList[0];
                            var pct1 = metrics.MonthlyExpense > 0 ? (top1.Amount / metrics.MonthlyExpense) * 100m : 0m;
                            sb.AppendLine($"\nEn yüksek harcamanız **{top1.Amount:N2} TL** ile **{top1.Category}** kategorisinde gerçekleşmiştir. Bu tutar, toplam harcamalarınızın **%{pct1:N1}**'ini oluşturmaktadır.");

                            if (topList.Count > 1)
                            {
                                var top2 = topList[1];
                                var pct2 = metrics.MonthlyExpense > 0 ? (top2.Amount / metrics.MonthlyExpense) * 100m : 0m;
                                sb.AppendLine($"İkinci sırada **{top2.Amount:N2} TL** ile **{top2.Category}** (%{pct2:N1}) gelmektedir.");
                            }

                            if (topList.Count > 2)
                            {
                                var top3 = topList[2];
                                var pct3 = metrics.MonthlyExpense > 0 ? (top3.Amount / metrics.MonthlyExpense) * 100m : 0m;
                                sb.AppendLine($"Üçüncü sırada ise **{top3.Amount:N2} TL** ile **{top3.Category}** (%{pct3:N1}) yer almaktadır.");
                            }
                        }
                    }

                    if (metrics.OverBudgetCategoryCount > 0)
                    {
                        sb.AppendLine($"\n⚠️ **Bütçe Uyarısı:** Toplam {metrics.OverBudgetCategoryCount} kategoride tanımlanan bütçe limitleri aşılmıştır.");
                    }

                    return sb.ToString();
                }

            case AIIntentType.BudgetAdviceQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"Aylık **{metrics.MonthlyIncome:N2} TL** geliriniz ve **{metrics.MonthlyExpense:N2} TL** gideriniz ile net aylık **{metrics.NetSavings:N2} TL** tasarruf etmektesiniz (Tasarruf Oranı: **%{metrics.SavingsRate:N0}**). Finansal sağlık skorunuz **{metrics.FinancialHealthScore}/100** ({metrics.RiskLevel}) seviyesindedir.");
                    sb.AppendLine("\n**Bütçe İyileştirme Önerileri:**");

                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory) && metrics.LargestSpendingCategory != "Yok")
                    {
                        sb.AppendLine($"1. **Büyüme Odaklı Kısıntı:** En yüksek harcamanız olan **{metrics.LargestSpendingCategory}** ({metrics.LargestSpendingAmount:N2} TL) kategorisinde esnek harcamalarınızı %10 kısıtlayarak aylık **{(metrics.LargestSpendingAmount * 0.10m):N2} TL** ek bütçe alanı yaratabilirsiniz.");
                    }

                    if (metrics.OverBudgetCategoryCount > 0)
                    {
                        sb.AppendLine($"2. **Bütçe Limit Uyumu:** Limit aşımı olan {metrics.OverBudgetCategoryCount} kategorinizdeki tavan limitleri gözden geçirip harcama uyarıları eklemeniz önerilir.");
                    }
                    else
                    {
                        sb.AppendLine("2. **Bütçe Disiplini:** Tanımlı tüm bütçe kategorilerinizde limitlere uyuyorsunuz.");
                    }

                    if (metrics.ActiveSubscriptionCount > 0)
                    {
                        sb.AppendLine($"3. **Sabit Gider Dengesi:** Aktif {metrics.ActiveSubscriptionCount} aboneliğinize ödenen aylık **{metrics.TotalMonthlySubscriptionCost:N2} TL** tutarını gözden geçirerek esnek bütçenizi genişletebilirsiniz.");
                    }

                    return sb.ToString();
                }

            case AIIntentType.SavingsAdviceQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"Bu ayki net aylık tasarrufunuz **{metrics.NetSavings:N2} TL** olup tasarruf oranınız **%{metrics.SavingsRate:N0}** seviyesindedir.");
                    sb.AppendLine("\n**Kişiselleştirilmiş Tasarruf Önerileri:**");

                    if (metrics.SavingsRate < 20m)
                    {
                        var target20 = metrics.MonthlyIncome * 0.20m;
                        var needed = target20 - metrics.NetSavings;
                        sb.AppendLine($"1. **Tasarruf Hedefi:** Mevcut tasarruf oranınız ideal %20 hedefinin altındadır. Aylık **{needed:N2} TL** ek birikim sağlayarak ideal %20 tasarruf hedefine ulaşabilirsiniz.");
                    }
                    else
                    {
                        sb.AppendLine("1. **Tasarruf Oranı:** Tasarruf oranınız %20 standart hedefinin üzerindedir! Bir birikim hesabı veya yatırım portföyü ile paranızı büyütebilirsiniz.");
                    }

                    if (metrics.ActiveSubscriptionCount > 0)
                    {
                        sb.AppendLine($"2. **Abonelik Tasarrufu:** Aktif {metrics.ActiveSubscriptionCount} adet aboneliğinize aylık **{metrics.TotalMonthlySubscriptionCost:N2} TL** ödemektesiniz. En yüksek tutarlı aboneliğiniz olan **{metrics.MostExpensiveSubscriptionName} ({metrics.MostExpensiveSubscriptionPrice:N2} TL)** kalemini inceleyerek tasarruf yaratabilirsiniz.");
                    }

                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory) && metrics.LargestSpendingCategory != "Yok")
                    {
                        sb.AppendLine($"3. **Kategori Optimizasyonu:** En büyük gider alanınız **{metrics.LargestSpendingCategory}** ({metrics.LargestSpendingAmount:N2} TL) harcamalarınızda küçük bir tasarruf ile aylık **{(metrics.LargestSpendingAmount * 0.10m):N2} TL** fon biriktirebilirsiniz.");
                    }

                    return sb.ToString();
                }

            case AIIntentType.ForecastQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"Geçmiş nakit akışınız ve finansal alışkanlıklarınız incelendiğinde, önümüzdeki ay tahmini olarak **{metrics.MonthlyIncome:N2} TL** gelir ve yaklaşık **{metrics.MonthlyExpense:N2} TL** gider beklenmektedir.");
                    sb.AppendLine("\n**Gelecek Ay Tahmin Detayları:**");
                    sb.AppendLine($"• **Tahmini Net Akış:** Önümüzdeki ay yaklaşık **{metrics.NetSavings:N2} TL** net tasarruf bakiyesi oluşması öngörülmektedir.");
                    if (metrics.ActiveSubscriptionCount > 0)
                    {
                        sb.AppendLine($"• **Sabit Abonelik Yükü:** Aktif abonelikleriniz nedeniyle önümüzdeki ay en az **{metrics.TotalMonthlySubscriptionCost:N2} TL** sabitleşmiş gideriniz olacaktır.");
                    }
                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory) && metrics.LargestSpendingCategory != "Yok")
                    {
                        sb.AppendLine($"• **Bütçe Takibi:** En yüksek harcama eğiliminiz olan **{metrics.LargestSpendingCategory}** kategorisindeki giderlerinizi takip etmeniz önerilir.");
                    }
                    return sb.ToString();
                }

            case AIIntentType.FinancialHealthQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"FinanceFocus Finansal Motoru verilerinize göre genel finansal sağlık skorunuz **{metrics.FinancialHealthScore}/100** ve risk seviyeniz **{metrics.RiskLevel}** olarak hesaplanmıştır.");
                    sb.AppendLine("\n**Finansal Sağlık Metrikleriniz:**");
                    sb.AppendLine($"• **Gelir / Gider Dengesi:** Geliriniz giderinizin **{metrics.IncomeToExpenseRatio:N1} katıdır** (Gelir: {metrics.MonthlyIncome:N2} TL, Gider: {metrics.MonthlyExpense:N2} TL).");
                    sb.AppendLine($"• **Tasarruf Performansı:** Aylık net tasarrufunuz **{metrics.NetSavings:N2} TL** (%{metrics.SavingsRate:N0} tasarruf oranı).");
                    if (metrics.OverBudgetCategoryCount > 0)
                    {
                        sb.AppendLine($"• **Bütçe Uyum Riskleri:** {metrics.OverBudgetCategoryCount} kategoride belirlenen harcama limitleri aşılmıştır.");
                    }
                    sb.AppendLine($"• **Varlık Birikimi:** Toplam bakiyeniz **{metrics.TotalBalance:N2} TL** ve portföy değeriniz **{metrics.TotalPortfolioValue:N2} TL** seviyesindedir.");
                    return sb.ToString();
                }

            case AIIntentType.ExpenseReductionQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"Aylık **{metrics.MonthlyExpense:N2} TL** olan toplam giderlerinizi azaltmak için en etkili 3 odak noktası:");
                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory) && metrics.LargestSpendingCategory != "Yok")
                    {
                        sb.AppendLine($"1. **En Büyük Harcama Kalemi:** Toplam harcamanızın en büyük kısmını oluşturan **{metrics.LargestSpendingCategory}** ({metrics.LargestSpendingAmount:N2} TL) kategorisinde harcama limiti belirleyin.");
                    }
                    if (metrics.ActiveSubscriptionCount > 0)
                    {
                        sb.AppendLine($"2. **Abonelik Tasarrufu:** Aktif {metrics.ActiveSubscriptionCount} adet aboneliğinize aylık toplam **{metrics.TotalMonthlySubscriptionCost:N2} TL** ödüyorsunuz. Özellikle **{metrics.MostExpensiveSubscriptionName} ({metrics.MostExpensiveSubscriptionPrice:N2} TL)** aboneliğinizi gözden geçirebilirsiniz.");
                    }
                    if (metrics.OverBudgetCategoryCount > 0)
                    {
                        sb.AppendLine($"3. **Bütçe Aşımı Kontrolü:** Bütçesini aştığınız {metrics.OverBudgetCategoryCount} kategoride esnek giderleri durdurarak hızlı tasarruf sağlayabilirsiniz.");
                    }
                    else
                    {
                        sb.AppendLine("3. **Esnek Harcama Disiplini:** Günlük eğlence ve dışarıda yemek giderlerini haftalık bazda takip ederek harcamalarınızı düşürebilirsiniz.");
                    }
                    return sb.ToString();
                }

            case AIIntentType.ExpenseQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"Bu ay toplam gideriniz **{metrics.MonthlyExpense:N2} TL**'dir.");
                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory) && metrics.LargestSpendingCategory != "Yok")
                    {
                        var pct = metrics.MonthlyExpense > 0 ? (metrics.LargestSpendingAmount / metrics.MonthlyExpense) * 100m : 0m;
                        sb.AppendLine($"En çok harcama yaptığınız kategori **{metrics.LargestSpendingCategory}** (**{metrics.LargestSpendingAmount:N2} TL**) olup toplam giderinizin **%{pct:N1}**'ini oluşturmaktadır.");
                    }
                    return sb.ToString();
                }

            case AIIntentType.LargestExpenseQuestion:
                {
                    if (metrics.MonthlyExpense == 0)
                    {
                        return "Bu ay henüz kayıtlı bir harcamanız bulunmamaktadır.";
                    }
                    var pct = metrics.MonthlyExpense > 0 ? (metrics.LargestSpendingAmount / metrics.MonthlyExpense) * 100m : 0m;
                    return $"Bu ay en çok harcama yaptığınız kategori **{metrics.LargestSpendingCategory}** kategorisidir. Toplam harcama tutarı **{metrics.LargestSpendingAmount:N2} TL** olup bu ayki toplam giderinizin **%{pct:N1}**'ine karşılık gelmektedir.";
                }

            case AIIntentType.SavingsQuestion:
            case AIIntentType.SavingsRateQuestion:
                {
                    return $"Bu ay toplam geliriniz **{metrics.MonthlyIncome:N2} TL**, toplam gideriniz **{metrics.MonthlyExpense:N2} TL** olup net aylık tasarrufunuz **{metrics.NetSavings:N2} TL** olarak gerçekleşmiştir (Tasarruf Oranı: **%{metrics.SavingsRate:N0}**).";
                }

            case AIIntentType.SubscriptionAnalysisQuestion:
            case AIIntentType.SubscriptionQuestion:
                {
                    if (metrics.ActiveSubscriptionCount == 0)
                    {
                        return "Henüz aktif bir abonelik kaydınız bulunmamaktadır. Abonelikler sayfasından ilk aboneliğinizi ekleyebilirsiniz.";
                    }
                    return $"Aktif **{metrics.ActiveSubscriptionCount}** adet aboneliğinize aylık toplam **{metrics.TotalMonthlySubscriptionCost:N2} TL** ödemektesiniz. Bu tutar aylık gelirinizin **%{metrics.SubscriptionToIncomePercentage:N1}**'ine denk gelmektedir. En yüksek giderli aboneliğiniz **{metrics.MostExpensiveSubscriptionName}** (**{metrics.MostExpensiveSubscriptionPrice:N2} TL/Ay**)'dir.";
                }

            case AIIntentType.PortfolioAnalysisQuestion:
            case AIIntentType.PortfolioValueQuestion:
                {
                    if (metrics.TotalPortfolioValue == 0 && metrics.TotalPortfolioInvestment == 0)
                    {
                        return "Henüz portföyünüzde bir varlık kaydı bulunmamaktadır. Portföy sayfasından ilk hisse, altın veya kripto varlığınızı ekleyebilirsiniz.";
                    }
                    return $"Portföyünüzün toplam güncel değeri **{metrics.TotalPortfolioValue:N2} TL** seviyesindedir. Toplam yatırım maliyetiniz **{metrics.TotalPortfolioInvestment:N2} TL** olup net kâr/zarar durumunuz **{metrics.TotalPortfolioProfitLoss:N2} TL** (%{metrics.TotalPortfolioProfitLossPercentage:N1}) olarak hesaplanmıştır.";
                }

            case AIIntentType.IncomeQuestion:
                return $"Aylık geliriniz **{metrics.MonthlyIncome:N2} TL**'dir (Net aylık tasarrufunuz: **{metrics.NetSavings:N2} TL**).";

            case AIIntentType.ExpenseComparisonQuestion:
                var isHigher = metrics.MonthlyIncome >= metrics.MonthlyExpense;
                var compPrefix = isHigher ? "Geliriniz giderinizden fazladır" : "Gideriniz gelirinizden fazladır";
                return $"{compPrefix}. Geliriniz giderinizin yaklaşık **{metrics.IncomeToExpenseRatio:N1} katıdır** (Aylık Gelir: **{metrics.MonthlyIncome:N2} TL**, Aylık Gider: **{metrics.MonthlyExpense:N2} TL**).";

            default:
                var defSb = new StringBuilder();
                defSb.AppendLine($"Aylık **{metrics.MonthlyIncome:N2} TL** geliriniz, **{metrics.MonthlyExpense:N2} TL** gideriniz ve **{metrics.NetSavings:N2} TL** net tasarrufunuz bulunmaktadır (%{metrics.SavingsRate:N0} tasarruf oranı). Finansal sağlık skorunuz **{metrics.FinancialHealthScore}/100**'dür.");
                return defSb.ToString();
        }
    }

    private static bool TryGetFactResponse(AIIntentType intent, FinancialCoreMetricsDto metrics, out string factResponse)
    {
        factResponse = string.Empty;
        if (intent == AIIntentType.GeneralConversation)
        {
            factResponse = "Ben FinanceFocus finansal asistanıyım. Finansal konular dışındaki sorulara yanıt veremiyorum. Gelir, gider, bütçe, abonelikler, tasarruf ve portföy gibi konularda sorularınızı sorabilirsiniz.";
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

        return rawAnswer.Trim();
    }
}
