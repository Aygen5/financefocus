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
        sb.AppendLine("Sen FinanceFocus uygulamasının akıllı ve profesyonel finansal asistanısın. Kullanıcının sorusuna doğrudan, samimi, anlaşılır ve kusursuz bir Türkçe ile yanıt ver.");
        sb.AppendLine("KATI KURALLAR:");
        sb.AppendLine("1. ASLA verilen backend metrikleri dışında rastgele sayı veya veri UYDURMA.");
        sb.AppendLine("2. Kullanıcının sorduğu özel soru ne ise O SORUYA ODAKLAN. Sabit bir şablon veya genel başlık kalıpları tekrarlama.");
        sb.AppendLine("3. Kullanıcı harcamalarını, bütçesini, tasarruflarını veya aboneliklerini sorduğunda aşağıdaki gerçek verilerini kullanarak somut rakamlar ver.");
        sb.AppendLine("4. Çıktılarını okunaklı maddeler veya kısa paragraflar halinde sun.");
        sb.AppendLine();
        sb.AppendLine("KULLANICININ GERÇEK HESAPLANMIŞ FİNANSAL METRİKLERİ (SINGLE SOURCE OF TRUTH):");
        sb.AppendLine($"- Aylık Gelir: {metrics.MonthlyIncome:N2} TL");
        sb.AppendLine($"- Aylık Gider: {metrics.MonthlyExpense:N2} TL");
        sb.AppendLine($"- Net Aylık Tasarruf: {metrics.NetSavings:N2} TL");
        sb.AppendLine($"- Tasarruf Oranı: %{metrics.SavingsRate:N0}");
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
