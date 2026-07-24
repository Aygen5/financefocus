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
        sb.AppendLine("Sen FinanceFocus uygulamasının resmi ve profesyonel finansal asistanısın.");
        sb.AppendLine("Görevin: Aşağıda backend tarafından hesaplanmış GÜNCEL METRİKLERİ temel alarak kullanıcının sorusunu Türkçe olarak 2-3 kısa, net cümle ile profesyonelce yanıtlamak ve değerlendirmektir.");
        sb.AppendLine("KATI KURALLAR:");
        sb.AppendLine("1. ASLA yeni sayı, yüzde, oran veya kategori UYDURMA.");
        sb.AppendLine("2. ASLA matematiksel hesaplama yapma. Sadece verilen backend verilerini yorumla.");
        sb.AppendLine("3. ASLA link, URL veya alan adı üretme.");
        sb.AppendLine("4. Tüm finansal terimleri doğru Türkçe grameri ile yaz ('portföy', 'gelir', 'gider', 'zarar').");
        sb.AppendLine("5. Yorumunu tamamla ve cümleni yarım bırakma.");
        sb.AppendLine("HESAPLANMIŞ GÜNCEL FİNANSAL METRİKLER:");

        switch (intent)
        {
            case AIIntentType.AnalysisPortfolio:
                sb.AppendLine($"- Portföy Toplam Değeri: {metrics.TotalPortfolioValue:N2} TL");
                sb.AppendLine($"- Portföy Yatırım Tutarı: {metrics.TotalPortfolioInvestment:N2} TL");
                sb.AppendLine($"- Portföy Net Kâr/Zarar: {metrics.TotalPortfolioProfitLoss:N2} TL (%{metrics.TotalPortfolioProfitLossPercentage:N1})");
                break;

            case AIIntentType.AnalysisSpending:
            case AIIntentType.FactSubscriptions:
                sb.AppendLine($"- Aylık Gelir: {metrics.MonthlyIncome:N2} TL");
                sb.AppendLine($"- Aylık Gider: {metrics.MonthlyExpense:N2} TL");
                sb.AppendLine($"- En Çok Harcanan Kategori: {metrics.LargestSpendingCategory} ({metrics.LargestSpendingAmount:N2} TL)");
                sb.AppendLine($"- Bütçe Aşımı Olan Kategori Sayısı: {metrics.OverBudgetCategoryCount}");
                sb.AppendLine($"- Toplam Aylık Abonelik Gideri: {metrics.TotalMonthlySubscriptionCost:N2} TL ({metrics.ActiveSubscriptionCount} Adet Aktif)");
                if (metrics.CategoryExpenses.Any())
                {
                    sb.AppendLine("- Kategori Harcama Dağılımı:");
                    foreach (var cat in metrics.CategoryExpenses.OrderByDescending(c => c.Amount).Take(5))
                    {
                        sb.AppendLine($"  * {cat.Category}: {cat.Amount:N2} TL (Limit: {cat.Limit:N2} TL)");
                    }
                }
                break;

            case AIIntentType.RecommendationSavings:
                sb.AppendLine($"- Aylık Gelir: {metrics.MonthlyIncome:N2} TL");
                sb.AppendLine($"- Aylık Gider: {metrics.MonthlyExpense:N2} TL");
                sb.AppendLine($"- Net Aylık Tasarruf: {metrics.NetSavings:N2} TL");
                sb.AppendLine($"- Tasarruf Oranı: %{metrics.SavingsRate:N0}");
                sb.AppendLine($"- Toplam Aylık Abonelik Gideri: {metrics.TotalMonthlySubscriptionCost:N2} TL ({metrics.ActiveSubscriptionCount} Adet)");
                break;

            default:
                sb.AppendLine($"- Finansal Sağlık Skoru: {metrics.FinancialHealthScore}/100");
                sb.AppendLine($"- Backend Risk Seviyesi: {metrics.RiskLevel}");
                sb.AppendLine($"- Tasarruf Oranı: %{metrics.SavingsRate:N0}");
                sb.AppendLine($"- Bütçe Aşımı Olan Kategori Sayısı: {metrics.OverBudgetCategoryCount}");
                break;
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
        return BuildSystemPromptWithContext(metrics, AIIntentType.GeneralAdvisory) + "\n\nKULLANICI SORUSU:\n" + userPrompt;
    }
}
