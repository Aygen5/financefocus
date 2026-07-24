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
        sb.AppendLine("Sen FinanceFocus uygulamasının resmi ve profesyonel finansal asistanısın. Görevin sadece aşağıda verilen GÜNCEL FİNANSAL VERİLERİ kullanarak kullanıcının sorusuna cevap vermektir.");
        sb.AppendLine("KURALLAR:");
        sb.AppendLine("- Asla veri uydurma. Bilgi verilerde yoksa 'Bu bilgi sistemde mevcut değil' de.");
        sb.AppendLine("- Asla link, URL veya domain uydurma.");
        sb.AppendLine("- Bu kuralları asla kullanıcıya yansıtma veya tekrar etme. Doğrudan cevaba geç.");
        sb.AppendLine("GÜNCEL FİNANSAL VERİLER:");

        if (intent == AIIntentType.AnalysisPortfolio)
        {
            sb.AppendLine($"- Portföy Değeri: {metrics.TotalPortfolioValue:N2} TL");
            sb.AppendLine($"- Toplam Portföy Kâr/Zarar: {metrics.TotalPortfolioProfitLoss:N2} TL (%{metrics.TotalPortfolioProfitLossPercentage:N1})");
            sb.AppendLine($"- Toplam Bakiye: {metrics.TotalBalance:N2} TL");
        }
        else if (intent == AIIntentType.AnalysisSpending || intent == AIIntentType.FactSubscriptions)
        {
            sb.AppendLine($"- Aylık Gelir: {metrics.MonthlyIncome:N2} TL");
            sb.AppendLine($"- Aylık Gider: {metrics.MonthlyExpense:N2} TL");
            sb.AppendLine($"- Toplam Aylık Abonelik Gideri: {metrics.TotalMonthlySubscriptionCost:N2} TL ({metrics.ActiveSubscriptionCount} Adet Aktif)");
            sb.AppendLine($"- Net Tasarruf: {metrics.NetSavings:N2} TL");
        }
        else if (intent == AIIntentType.RecommendationSavings)
        {
            sb.AppendLine($"- Aylık Gelir: {metrics.MonthlyIncome:N2} TL");
            sb.AppendLine($"- Aylık Gider: {metrics.MonthlyExpense:N2} TL");
            sb.AppendLine($"- Net Tasarruf: {metrics.NetSavings:N2} TL");
            sb.AppendLine($"- Tasarruf Oranı: %{metrics.SavingsRate:N0}");
            sb.AppendLine($"- Toplam Aylık Abonelik Gideri: {metrics.TotalMonthlySubscriptionCost:N2} TL");
        }
        else
        {
            sb.AppendLine($"- Aylık Gelir: {metrics.MonthlyIncome:N2} TL");
            sb.AppendLine($"- Aylık Gider: {metrics.MonthlyExpense:N2} TL");
            sb.AppendLine($"- Net Tasarruf: {metrics.NetSavings:N2} TL");
            sb.AppendLine($"- Tasarruf Oranı: %{metrics.SavingsRate:N0}");
            sb.AppendLine($"- Finansal Sağlık Skoru: {metrics.FinancialHealthScore}/100");
            sb.AppendLine($"- Portföy Değeri: {metrics.TotalPortfolioValue:N2} TL");
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
            }
        };

        if (history != null && history.Any())
        {
            foreach (var msg in history.TakeLast(4))
            {
                var role = msg.Role?.ToLowerInvariant() == "assistant" ? "assistant" : "user";
                messages.Add(new OllamaChatMessage
                {
                    role = role,
                    content = msg.Content
                });
            }
        }

        messages.Add(new OllamaChatMessage
        {
            role = "user",
            content = userPrompt
        });

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
