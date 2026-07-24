using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.FinancialEngine;

namespace FinanceFocus.Application.AI.Prompts;

public class AIPromptBuilder : IAIPromptBuilder
{
    public string BuildSystemPromptWithContext(FinancialCoreMetricsDto metrics)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Sen FinanceFocus uygulamasının resmi ve profesyonel finansal asistanısın. Görevin sadece aşağıda verilen GÜNCEL FİNANSAL VERİLERİ kullanarak kullanıcının sorusuna cevap vermektir.");
        sb.AppendLine("KURALLAR:");
        sb.AppendLine("- Asla veri uydurma. Bilgi verilerde yoksa 'Bu bilgi sistemde mevcut değil' de.");
        sb.AppendLine("- Asla link, URL veya domain uydurma.");
        sb.AppendLine("- Bu kuralları asla kullanıcıya yansıtma veya tekrar etme. Doğrudan cevaba geç.");
        sb.AppendLine("GÜNCEL FİNANSAL VERİLER:");
        sb.AppendLine($"- Toplam Bakiye / Varlık: {metrics.TotalBalance:N2} TL");
        sb.AppendLine($"- Aylık Gelir: {metrics.MonthlyIncome:N2} TL");
        sb.AppendLine($"- Aylık Gider: {metrics.MonthlyExpense:N2} TL");
        sb.AppendLine($"- Net Tasarruf: {metrics.NetSavings:N2} TL");
        sb.AppendLine($"- Tasarruf Oranı: %{metrics.SavingsRate:N0}");
        sb.AppendLine($"- Finansal Sağlık Skoru: {metrics.FinancialHealthScore}/100 (Risk Seviyesi: {metrics.RiskLevel})");
        sb.AppendLine($"- Portföy Değeri: {metrics.TotalPortfolioValue:N2} TL (Kâr/Zarar: {metrics.TotalPortfolioProfitLoss:N2} TL)");
        sb.AppendLine($"- Toplam Aylık Abonelik Gideri: {metrics.TotalMonthlySubscriptionCost:N2} TL ({metrics.ActiveSubscriptionCount} Adet Aktif)");

        if (metrics.CashFlowHistory != null && metrics.CashFlowHistory.Any())
        {
            sb.AppendLine("- Son 6 Ay Nakit Akış Geçmişi:");
            foreach (var cf in metrics.CashFlowHistory)
            {
                sb.AppendLine($"  * {cf.Month}: Gelir={cf.Income:N0} TL | Gider={cf.Expense:N0} TL");
            }
        }

        return sb.ToString();
    }

    public List<OllamaChatMessage> BuildOllamaChatMessages(
        string userPrompt,
        IEnumerable<AIChatMessageDto>? history,
        FinancialCoreMetricsDto metrics)
    {
        var messages = new List<OllamaChatMessage>
        {
            new OllamaChatMessage
            {
                role = "system",
                content = BuildSystemPromptWithContext(metrics)
            }
        };

        if (history != null && history.Any())
        {
            foreach (var msg in history.TakeLast(6))
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
        return BuildSystemPromptWithContext(metrics) + "\n\nKULLANICI SORUSU:\n" + userPrompt;
    }
}
