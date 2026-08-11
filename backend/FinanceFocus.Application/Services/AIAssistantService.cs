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
            case AIIntentType.FinancialHealthQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"Finansal sağlık skorunuz **%{metrics.FinancialHealthScore}** seviyesindedir (Risk Profili: **{metrics.RiskLevel}**).");

                    if (metrics.FinancialHealthScore >= 85)
                    {
                        sb.AppendLine("\nBu skor, finansal durumunuzun ve bütçe yapınızın son derece güçlü, dengeli ve sürdürülebilir olduğunu göstermektedir.");
                    }
                    else if (metrics.FinancialHealthScore >= 60)
                    {
                        sb.AppendLine("\nBu skor, finansal durumunuzun tamamen kötü olmadığını ancak iyileştirilmesi gereken alanlar bulunduğunu gösteriyor.");
                    }
                    else
                    {
                        sb.AppendLine("\nBu skor, bütçenizde dikkat edilmesi gereken hassas noktalar ve yüksek harcama riskleri bulunduğunu gösteriyor.");
                    }

                    sb.AppendLine($"Aylık **{metrics.MonthlyIncome:N2} TL** geliriniz ile **{metrics.MonthlyExpense:N2} TL** harcamanız arasındaki fark ve **%{metrics.SavingsRate:N0}** olan tasarruf oranınız bu skoru etkileyen en önemli faktörler arasındadır.");

                    if (metrics.NetSavings > 0)
                    {
                        sb.AppendLine($"Gelirinizin giderinizden **{metrics.IncomeToExpenseRatio:N1} kat** fazla olması ve her ay net **{metrics.NetSavings:N2} TL** biriktirebiliyor olmanız finansal dayanıklılığınızı artırmaktadır.");
                    }
                    else if (metrics.MonthlyExpense > metrics.MonthlyIncome)
                    {
                        sb.AppendLine("Aylık harcamanızın gelirinizi aşmış olması finansal risk skoru üzerinde baskı oluşturmaktadır.");
                    }

                    if (metrics.OverBudgetCategoryCount > 0)
                    {
                        sb.AppendLine($"Özellikle **{metrics.OverBudgetCategoryCount}** kategoride belirlenen bütçe limitlerinin aşılmış olması skorunuzu olumsuz etkileyen unsurlardandır.");
                    }

                    if (metrics.ActiveSubscriptionCount > 0)
                    {
                        sb.AppendLine($"Mevcut {metrics.ActiveSubscriptionCount} adet aboneliğinize ödenen aylık **{metrics.TotalMonthlySubscriptionCost:N2} TL** tutarındaki düzenli ödemelerinizi de gözden geçirebilirsiniz.");
                    }

                    sb.AppendLine($"Genel olarak finansal durumunuz kontrol edilebilir seviyededir. En yüksek harcama yaptığınız **{metrics.LargestSpendingCategory}** ({metrics.LargestSpendingAmount:N2} TL) kategorisini kısıtlayarak ve birikimlerinizi artırarak skorunuzu daha da yükseltebilirsiniz.");
                    return sb.ToString();
                }

            case AIIntentType.SpendingAnalysisQuestion:
                {
                    if (metrics.MonthlyExpense == 0)
                    {
                        return "Bu ay henüz kayıtlı bir harcamanız bulunmamaktadır. Harcama eklediğinizde detaylı analizlerinizi burada görebilirsiniz.";
                    }

                    var sb = new StringBuilder();
                    sb.AppendLine($"Bu ay toplam **{metrics.MonthlyExpense:N2} TL** harcama gerçekleştirdiniz.");

                    if (metrics.CategoryExpenses != null && metrics.CategoryExpenses.Any())
                    {
                        var topList = metrics.CategoryExpenses.OrderByDescending(c => c.Amount).Take(3).ToList();
                        if (topList.Count > 0)
                        {
                            var top1 = topList[0];
                            var pct1 = metrics.MonthlyExpense > 0 ? (top1.Amount / metrics.MonthlyExpense) * 100m : 0m;
                            sb.AppendLine($"\nHarcamalarınızın en büyük kısmını **{top1.Amount:N2} TL** ile **{top1.Category}** kategorisi oluşturmaktadır. Bu tutar, aylık toplam giderinizin **%{pct1:N1}**'ine denk gelerek bütçenizde önemli bir ağırlık taşımaktadır.");

                            if (topList.Count > 1)
                            {
                                var top2 = topList[1];
                                var pct2 = metrics.MonthlyExpense > 0 ? (top2.Amount / metrics.MonthlyExpense) * 100m : 0m;
                                sb.AppendLine($"İkinci sırada **{top2.Amount:N2} TL** ile **{top2.Category}** (%{pct2:N1}) yer almaktadır.");
                            }

                            if (topList.Count > 2)
                            {
                                var top3 = topList[2];
                                var pct3 = metrics.MonthlyExpense > 0 ? (top3.Amount / metrics.MonthlyExpense) * 100m : 0m;
                                sb.AppendLine($"Üçüncü sırada ise **{top3.Amount:N2} TL** ile **{top3.Category}** (%{pct3:N1}) bulunmaktadır.");
                            }
                        }
                    }

                    if (metrics.OverBudgetCategoryCount > 0)
                    {
                        sb.AppendLine($"\n⚠️ Toplam **{metrics.OverBudgetCategoryCount}** kategoride belirlenen harcama limitleri aşılmıştır. Bu durum bütçe dengesini olumsuz etkileyebilir.");
                    }

                    sb.AppendLine($"\nEn yüksek gider kalemi olan **{metrics.LargestSpendingCategory}** harcamalarınızı kısıtlamanız ve esnek giderleri kontrol altında tutmanız aylık tasarruf kapasitenizi artıracaktır.");
                    return sb.ToString();
                }

            case AIIntentType.SavingsAdviceQuestion:
            case AIIntentType.SavingsQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"Bu ayki net aylık tasarrufunuz **{metrics.NetSavings:N2} TL** olup tasarruf oranınız **%{metrics.SavingsRate:N0}** seviyesindedir.");

                    if (metrics.SavingsRate >= 20m)
                    {
                        sb.AppendLine("\nTasarruf oranınız finansal standartlarda ideal kabul edilen %20 barajının üzerindedir. Bu durum, aylık nakit akışınızı doğru yönettiğinizi ve finansal hedeflerinize hızlı ilerlediğinizi gösterir.");
                    }
                    else
                    {
                        var target20 = metrics.MonthlyIncome * 0.20m;
                        var needed = target20 - metrics.NetSavings;
                        sb.AppendLine($"\nMevcut tasarruf oranınız %20 hedefinin altında kalmaktadır. İdeal %20 tasarruf oranına ulaşmak için aylık **{needed:N2} TL** daha birikim yapmanız önerilir.");
                    }

                    if (metrics.ActiveSubscriptionCount > 0)
                    {
                        sb.AppendLine($"\nAktif {metrics.ActiveSubscriptionCount} adet aboneliğinize ödenen aylık **{metrics.TotalMonthlySubscriptionCost:N2} TL** tutarı gözden geçirerek, özellikle en pahalı olan **{metrics.MostExpensiveSubscriptionName} ({metrics.MostExpensiveSubscriptionPrice:N2} TL)** ödemesini optimize edebilirsiniz.");
                    }

                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory) && metrics.LargestSpendingCategory != "Yok")
                    {
                        sb.AppendLine($"Ayrıca en yüksek harcama yaptığınız **{metrics.LargestSpendingCategory}** ({metrics.LargestSpendingAmount:N2} TL) harcamalarınızda %10 kısıntı yapmak aylık **{(metrics.LargestSpendingAmount * 0.10m):N2} TL** ek tasarruf kazandıracaktır.");
                    }

                    return sb.ToString();
                }

            case AIIntentType.BudgetAdviceQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"Aylık **{metrics.MonthlyIncome:N2} TL** geliriniz ve **{metrics.MonthlyExpense:N2} TL** harcamanız bulunmakta, her ay net **{metrics.NetSavings:N2} TL** tasarruf yapabilmektesiniz (%{metrics.SavingsRate:N0} tasarruf oranı).");
                    sb.AppendLine($"Finansal sağlık skorunuz **{metrics.FinancialHealthScore}/100** ({metrics.RiskLevel}) seviyesindedir.");

                    sb.AppendLine("\n**Bütçe Yapınızı İyileştirmek İçin Değerlendirme:**");
                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory) && metrics.LargestSpendingCategory != "Yok")
                    {
                        sb.AppendLine($"1. **Büyüme Odaklı Kısıntı:** Bütçenizin en büyük bölümünü oluşturan **{metrics.LargestSpendingCategory}** ({metrics.LargestSpendingAmount:N2} TL) alanında tavan limit belirlemeniz harcama sapmalarını önleyecektir.");
                    }

                    if (metrics.OverBudgetCategoryCount > 0)
                    {
                        sb.AppendLine($"2. **Bütçe Limit Kontrolü:** Limit aşımı olan {metrics.OverBudgetCategoryCount} kategorinizdeki harcamaları durdurmanız veya bütçe limitlerinizi güncellemeniz önerilir.");
                    }
                    else
                    {
                        sb.AppendLine("2. **Bütçe Disiplini:** Tanımlı bütçe limitlerinizin tamamına uyuyorsunuz, bu disiplini korumanız önemlidir.");
                    }

                    if (metrics.ActiveSubscriptionCount > 0)
                    {
                        sb.AppendLine($"3. **Sabit Gider Yükü:** Aktif aboneliklerinize ödediğiniz aylık **{metrics.TotalMonthlySubscriptionCost:N2} TL** tutarındaki sabit giderleri azaltarak esnek bütçe alanınızı genişletebilirsiniz.");
                    }

                    return sb.ToString();
                }

            case AIIntentType.ForecastQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"Geçmiş finansal alışkanlıklarınız ve nakit akışınız değerlendirildiğinde, önümüzdeki ay tahmini olarak **{metrics.MonthlyIncome:N2} TL** gelir ve yaklaşık **{metrics.MonthlyExpense:N2} TL** harcama beklenmektedir.");
                    sb.AppendLine($"\nBu tahmin neticesinde gelecek ay yaklaşık **{metrics.NetSavings:N2} TL** net tasarruf bakiyesine ulaşmanız öngörülüyor.");

                    if (metrics.ActiveSubscriptionCount > 0)
                    {
                        sb.AppendLine($"Aktif abonelikleriniz nedeniyle gelecek ay en az **{metrics.TotalMonthlySubscriptionCost:N2} TL** sabitleşmiş abonelik ödemeniz gerçekleşecektir.");
                    }

                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory) && metrics.LargestSpendingCategory != "Yok")
                    {
                        sb.AppendLine($"En yüksek harcama eğiliminiz olan **{metrics.LargestSpendingCategory}** kategorisindeki giderlerinizi takip ederek bütçe hedeflerinizi koruyabilirsiniz.");
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
                    sb.AppendLine($"Aktif **{metrics.ActiveSubscriptionCount}** adet aboneliğinize aylık toplam **{metrics.TotalMonthlySubscriptionCost:N2} TL** ödemektesiniz.");
                    sb.AppendLine($"Bu tutar, aylık gelirinizin **%{metrics.SubscriptionToIncomePercentage:N1}**'ini oluşturmaktadır.");
                    sb.AppendLine($"En yüksek giderli aboneliğiniz **{metrics.MostExpensiveSubscriptionName}** (**{metrics.MostExpensiveSubscriptionPrice:N2} TL/Ay**)'dir.");
                    sb.AppendLine($"\nDüzenli abonelik ödemeleri zamanla biriken ve bütçeyi zorlayan kalemlerdir. Az kullandığınız servisleri iptal ederek bu bütçeyi birikimlerinize aktarabilirsiniz.");
                    return sb.ToString();
                }

            case AIIntentType.ExpenseReductionQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"Aylık **{metrics.MonthlyExpense:N2} TL** olan toplam giderlerinizi azaltmak ve daha güçlü bir finansal yapı kurmak için öneriler:");
                    if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory) && metrics.LargestSpendingCategory != "Yok")
                    {
                        sb.AppendLine($"\n1. **En Büyük Harcama Kalemi:** Toplam harcamanızın en büyük kısmını oluşturan **{metrics.LargestSpendingCategory}** ({metrics.LargestSpendingAmount:N2} TL) kategorisinde esnek harcamaları %10 kısıtlayarak **{(metrics.LargestSpendingAmount * 0.10m):N2} TL** tasarruf sağlayabilirsiniz.");
                    }
                    if (metrics.ActiveSubscriptionCount > 0)
                    {
                        sb.AppendLine($"2. **Abonelik Optimizasyonu:** Aktif {metrics.ActiveSubscriptionCount} aboneliğinize ödenen aylık **{metrics.TotalMonthlySubscriptionCost:N2} TL** sabit gideri (özellikle **{metrics.MostExpensiveSubscriptionName} - {metrics.MostExpensiveSubscriptionPrice:N2} TL**) azaltabilirsiniz.");
                    }
                    if (metrics.OverBudgetCategoryCount > 0)
                    {
                        sb.AppendLine($"3. **Bütçe Limit Kontrolü:** Bütçesini aştığınız {metrics.OverBudgetCategoryCount} kategoride harcamaları durdurarak bütçe dengenizi koruyabilirsiniz.");
                    }
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
                    sb.AppendLine($"Portföyünüzün toplam güncel değeri **{metrics.TotalPortfolioValue:N2} TL**, toplam yatırdığınız anapara maliyeti ise **{metrics.TotalPortfolioInvestment:N2} TL** seviyesindedir.");
                    sb.AppendLine($"Net kâr/zarar durumunuz **{metrics.TotalPortfolioProfitLoss:N2} TL** (Getiri Oranı: **%{metrics.TotalPortfolioProfitLossPercentage:N1}**) olarak hesaplanmıştır.");

                    if (metrics.TotalPortfolioProfitLoss >= 0)
                    {
                        sb.AppendLine($"\nPortföyünüz kârlı bir performans sergilemektedir. Varlık çeşitliliğinizi koruyarak piyasa risklerini dengede tutmanız ve aylık tasarruflarınızdan düzenli yatırıma devam etmeniz büyümenizi hızlandıracaktır.");
                    }
                    else
                    {
                        sb.AppendLine($"\nPortföyünüzde geçici bir değer kaybı görülmektedir. Varlık dağılımınızı gözden geçirip uzun vadeli yatırım stratejinizi korumanız önerilir.");
                    }
                    return sb.ToString();
                }

            case AIIntentType.RiskQuestion:
                {
                    var sb = new StringBuilder();
                    sb.AppendLine($"Finansal sağlık skorunuz **{metrics.FinancialHealthScore}/100** ve risk profili **{metrics.RiskLevel}** olarak değerlendirilmiştir.");
                    sb.AppendLine($"Geliriniz giderinizin **{metrics.IncomeToExpenseRatio:N1} katıdır** (Aylık Gelir: {metrics.MonthlyIncome:N2} TL, Gider: {metrics.MonthlyExpense:N2} TL). Tasarruf oranınız **%{metrics.SavingsRate:N0}**'dır.");
                    sb.AppendLine($"\nFinansal risk seviyenizin düşük kalması için harcamalarınızı gelirinize oranla dengeli tutmaya ve tasarruf oranınızı korumaya devam etmelisiniz.");
                    return sb.ToString();
                }

            case AIIntentType.ExpenseQuestion:
            case AIIntentType.LargestExpenseQuestion:
                {
                    if (metrics.MonthlyExpense == 0)
                    {
                        return "Bu ay henüz kayıtlı bir harcamanız bulunmamaktadır.";
                    }
                    var pct = metrics.MonthlyExpense > 0 ? (metrics.LargestSpendingAmount / metrics.MonthlyExpense) * 100m : 0m;
                    return $"Bu ay toplam gideriniz **{metrics.MonthlyExpense:N2} TL**'dir. En çok harcama yaptığınız kategori **{metrics.LargestSpendingCategory}** (**{metrics.LargestSpendingAmount:N2} TL**) olup toplam giderinizin **%{pct:N1}**'ini oluşturmaktadır. Bu harcama alanına dikkat ederek bütçenizi güçlendirebilirsiniz.";
                }

            case AIIntentType.IncomeQuestion:
                return $"Aylık geliriniz **{metrics.MonthlyIncome:N2} TL**'dir. Aylık gideriniz **{metrics.MonthlyExpense:N2} TL** olup her ay net **{metrics.NetSavings:N2} TL** (%{metrics.SavingsRate:N0}) birikim yapabilmektesiniz.";

            case AIIntentType.ExpenseComparisonQuestion:
                var isHigher = metrics.MonthlyIncome >= metrics.MonthlyExpense;
                var compPrefix = isHigher ? "Geliriniz giderinizden fazladır" : "Gideriniz gelirinizden fazladır";
                return $"{compPrefix}. Geliriniz giderinizin yaklaşık **{metrics.IncomeToExpenseRatio:N1} katıdır** (Aylık Gelir: **{metrics.MonthlyIncome:N2} TL**, Aylık Gider: **{metrics.MonthlyExpense:N2} TL**). Düzenli tasarruf kapasitenizi korumanız finansal istikrarınız için önemlidir.";

            default:
                var defSb = new StringBuilder();
                defSb.AppendLine($"Aylık **{metrics.MonthlyIncome:N2} TL** geliriniz, **{metrics.MonthlyExpense:N2} TL** gideriniz ve **{metrics.NetSavings:N2} TL** net tasarrufunuz bulunmaktadır (%{metrics.SavingsRate:N0} tasarruf oranı). Finansal sağlık skorunuz **{metrics.FinancialHealthScore}/100** ({metrics.RiskLevel}) seviyesindedir. Genel olarak finansal yapınız kontrol edilebilir durumdadır.");
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
