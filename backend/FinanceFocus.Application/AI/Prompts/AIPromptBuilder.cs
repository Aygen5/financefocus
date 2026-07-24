using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.FinancialEngine;

namespace FinanceFocus.Application.AI.Prompts;

public class AIPromptBuilder : IAIPromptBuilder
{
    public string BuildSystemPrompt()
    {
        var sb = new StringBuilder();
        sb.AppendLine("Sen FinanceFocus uygulamasının uzman finans danışmanısın.");
        sb.AppendLine("Aşağıdaki KURALLARA KESİNLİKLE UYMALISIN:");
        sb.AppendLine("1. Asla veri uydurma (hallucination yapma).");
        sb.AppendLine("2. Asla URL, web sitesi veya domain ismi uydurma.");
        sb.AppendLine("3. Asla 'verilerinizi koruyoruz' veya genel AI güvenlik metinleri üretme.");
        sb.AppendLine("4. Sadece verilen finansal verileri kullan. Veri mevcut değilse 'Bu veri sistemde mevcut değil' de.");
        sb.AppendLine("5. Kullanıcının sorusuna doğrudan, net, öz ve Türkçe yanıt ver.");
        return sb.ToString();
    }

    public string BuildFullPrompt(
        string userPrompt,
        IEnumerable<AIChatMessageDto>? history,
        FinancialCoreMetricsDto metrics)
    {
        var sb = new StringBuilder();

        sb.AppendLine(BuildSystemPrompt());
        sb.AppendLine();
        sb.AppendLine("KULLANICININ GERÇEK FİNANSAL VERİLERİ:");
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

        if (history != null && history.Any())
        {
            sb.AppendLine();
            sb.AppendLine("SON SOHBET GEÇMİŞİ:");
            foreach (var msg in history.TakeLast(4))
            {
                var roleLabel = msg.Role?.ToLowerInvariant() == "assistant" ? "Asistan" : "Kullanıcı";
                sb.AppendLine($"{roleLabel}: {msg.Content}");
            }
        }

        sb.AppendLine();
        sb.AppendLine("KULLANICININ SORUSU:");
        sb.AppendLine(userPrompt);
        sb.AppendLine();
        sb.AppendLine("CEVAP:");

        return sb.ToString();
    }
}
