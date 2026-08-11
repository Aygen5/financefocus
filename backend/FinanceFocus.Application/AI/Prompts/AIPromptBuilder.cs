using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using FinanceFocus.Application.AI.Intent;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.FinancialEngine;

namespace FinanceFocus.Application.AI.Prompts;

public class AIPromptBuilder : IAIPromptBuilder
{
    public string BuildSystemPromptWithContext(FinancialCoreMetricsDto metrics, AIIntentType intent)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Sen FinanceFocus uygulamasının uzman, akıllı ve samimi finansal asistanısın. Kullanıcının sorusuna doğrudan, detaylı ve kusursuz bir Türkçe ile yanıt ver.");
        sb.AppendLine("KATI TALİMATLAR:");
        sb.AppendLine("1. ASLA verilen backend metrikleri dışında rastgele sayı veya veri UYDURMA.");
        sb.AppendLine("2. SADECE METRİKLERİ VE RAKAMLARI LİSTELEME! Kullanıcı 'Finansal sağlığımı yorumla', 'Harcamalarımı analiz et', 'Bütçemi değerlendir' gibi analiz/yorum istediğinde:");
        sb.AppendLine("   - Metriğin (skor, harcama tutarı, tasarruf oranı vb.) NE ANLAMA GELDİĞİNİ ve NEDEN bu seviyede olduğunu açıkla.");
        sb.AppendLine("   - Gelir/gider dengesini, harcama dağılımını, abonelik yükünü ve tasarruf kapasitesini birbiriyle ilişkilendirerek güçlü ve zayıf yönleri değerlendir.");
        sb.AppendLine("   - Kullanıcıya durumunu iyileştirmesi için 2-3 somut, uygulanabilir tavsiye ve eylem adımı sun.");
        sb.AppendLine("   - Yanıtın tek cümlelik veya yüzeysel olmamalı; en az 4-6 cümlelik anlamlı ve bütüncül bir değerlendirme içermelidir.");
        sb.AppendLine("3. Kullanıcı finansal olmayan bir soru sorduğunda (örn: hava durumu) kibarca sadece finansal konularda yardımcı olabileceğini belirt.");
        sb.AppendLine();
        sb.AppendLine("KULLANICININ GERÇEK HESAPLANMIŞ FİNANSAL METRİKLERİ (SINGLE SOURCE OF TRUTH):");
        sb.AppendLine($"- Aylık Gelir: {metrics.MonthlyIncome:N2} TL");
        sb.AppendLine($"- Aylık Gider: {metrics.MonthlyExpense:N2} TL");
        sb.AppendLine($"- Net Aylık Tasarruf: {metrics.NetSavings:N2} TL");
        sb.AppendLine($"- Tasarruf Oranı: %{metrics.SavingsRate:N0}");
        sb.AppendLine($"- Gelir / Gider Oranı: {metrics.IncomeToExpenseRatio:N1} Kat");
        sb.AppendLine($"- Toplam Bakiye: {metrics.TotalBalance:N2} TL");
        sb.AppendLine($"- Finansal Sağlık Skoru: {metrics.FinancialHealthScore}/100 ({metrics.RiskLevel} Risk Grubu)");

        if (!string.IsNullOrEmpty(metrics.LargestSpendingCategory))
        {
            sb.AppendLine($"- En Yüksek Harcama Yapılan Kategori: {metrics.LargestSpendingCategory} ({metrics.LargestSpendingAmount:N2} TL)");
        }

        if (metrics.OverBudgetCategoryCount > 0)
        {
            sb.AppendLine($"- Bütçe Aşımı Olan Kategori Sayısı: {metrics.OverBudgetCategoryCount}");
        }

        if (metrics.CategoryExpenses != null && metrics.CategoryExpenses.Any())
        {
            sb.AppendLine("- Kategori Harcama Dağılımı:");
            foreach (var cat in metrics.CategoryExpenses.OrderByDescending(c => c.Amount).Take(5))
            {
                var limitStr = cat.Limit > 0 ? $" (Bütçe Limiti: {cat.Limit:N2} TL)" : string.Empty;
                sb.AppendLine($"  * {cat.Category}: {cat.Amount:N2} TL{limitStr}");
            }
        }

        if (metrics.ActiveSubscriptionCount > 0)
        {
            sb.AppendLine($"- Aktif Abonelik Sayısı: {metrics.ActiveSubscriptionCount} Adet (Aylık Toplam Maliyet: {metrics.TotalMonthlySubscriptionCost:N2} TL)");
            if (!string.IsNullOrEmpty(metrics.MostExpensiveSubscriptionName))
            {
                sb.AppendLine($"  * En Pahalısı: {metrics.MostExpensiveSubscriptionName} ({metrics.MostExpensiveSubscriptionPrice:N2} TL)");
            }
        }

        if (metrics.TotalPortfolioValue > 0 || metrics.TotalPortfolioInvestment > 0)
        {
            sb.AppendLine($"- Portföy Toplam Değeri: {metrics.TotalPortfolioValue:N2} TL (Net Kâr/Zarar: {metrics.TotalPortfolioProfitLoss:N2} TL / %{metrics.TotalPortfolioProfitLossPercentage:N1})");
        }

        return sb.ToString();
    }

    public List<OllamaChatMessage> BuildOllamaChatMessages(
        string userPrompt,
        AIIntentType intent,
        IEnumerable<AIChatMessageDto>? history,
        FinancialCoreMetricsDto metrics)
    {
        var messages = new List<OllamaChatMessage>
        {
            new OllamaChatMessage
            {
                role = "system",
                content = BuildSystemPromptWithContext(metrics, intent)
            },
            new OllamaChatMessage
            {
                role = "user",
                content = userPrompt
            }
        };

        return messages;
    }

    public string BuildFullPrompt(
        string userPrompt,
        IEnumerable<AIChatMessageDto>? history,
        FinancialCoreMetricsDto metrics)
    {
        return BuildSystemPromptWithContext(metrics, AIIntentType.GeneralConversation) + "\n\nKULLANICI SORUSU:\n" + userPrompt;
    }
}
