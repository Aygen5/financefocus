using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.Dashboard;
using FinanceFocus.Application.DTOs.FinancialHealth;
using FinanceFocus.Application.DTOs.Forecast;
using FinanceFocus.Application.Interfaces;

namespace FinanceFocus.Application.Services.Providers;

public class RuleBasedAIProvider : IAIProvider
{
    private readonly IFinancialEngineService _financialEngineService;

    public string ProviderName => "RuleBasedAIProvider";

    public RuleBasedAIProvider(IFinancialEngineService financialEngineService)
    {
        _financialEngineService = financialEngineService;
    }

    public async Task<IEnumerable<AIAdviceDto>> GenerateAdvicesAsync(
        string userId,
        DashboardDto dashboard,
        FinancialHealthDto health,
        ForecastDto forecast)
    {
        var metricsResult = await _financialEngineService.CalculateCoreMetricsAsync(userId);
        var metrics = metricsResult.Data ?? new DTOs.FinancialEngine.FinancialCoreMetricsDto();

        var list = new List<AIAdviceDto>();

        if (metrics.MonthlyExpense > metrics.MonthlyIncome && metrics.MonthlyIncome > 0)
        {
            list.Add(new AIAdviceDto
            {
                Title = "Bütçe Dengesi Kurulamadı",
                Message = $"Bu ayki harcamalarınız ({metrics.MonthlyExpense:N2} TL) gelirinizden ({metrics.MonthlyIncome:N2} TL) fazla.",
                Category = "Harcama Analizi",
                Priority = "High",
                Type = "Warning"
            });
        }
        else
        {
            list.Add(new AIAdviceDto
            {
                Title = "Dengeli Harcama Profili",
                Message = "Aylık harcamalarınız gelir sınırlarınız içerisinde seyretmektedir.",
                Category = "Harcama Analizi",
                Priority = "Low",
                Type = "Success"
            });
        }

        if (metrics.SavingsRate < 20m)
        {
            list.Add(new AIAdviceDto
            {
                Title = "Tasarruf Potansiyeli",
                Message = "Market ve değişken harcamalarınızı %10 azaltmanız finansal sağlık skorunuzu yükseltecektir.",
                Category = "Tasarruf Tavsiyesi",
                Priority = "Medium",
                Type = "Info"
            });
        }
        else
        {
            list.Add(new AIAdviceDto
            {
                Title = "Yüksek Tasarruf Performansı",
                Message = $"Aylık %{metrics.SavingsRate:N0} tasarruf oranınız finansal disiplininizin yüksek olduğunu gösteriyor.",
                Category = "Tasarruf Tavsiyesi",
                Priority = "Low",
                Type = "Success"
            });
        }

        list.Add(new AIAdviceDto
        {
            Title = "Finansal Sağlık Yorumu",
            Message = $"Finansal sağlık skorunuz 100 üzerinden {metrics.FinancialHealthScore} ({metrics.RiskLevel} risk seviyesi).",
            Category = "Finansal Sağlık Yorumu",
            Priority = metrics.FinancialHealthScore < 50 ? "High" : "Low",
            Type = metrics.FinancialHealthScore < 50 ? "Warning" : "Success"
        });

        return list;
    }

    public async Task<AIConversationSummaryDto> GenerateSummaryAsync(
        string userId,
        DashboardDto dashboard,
        FinancialHealthDto health,
        ForecastDto forecast)
    {
        var metricsResult = await _financialEngineService.CalculateCoreMetricsAsync(userId);
        var metrics = metricsResult.Data ?? new DTOs.FinancialEngine.FinancialCoreMetricsDto();

        var summaryText = $"Finansal durumunuz {metrics.RiskLevel} seviyesindedir. Aylık geliriniz {metrics.MonthlyIncome:N2} TL, gideriniz {metrics.MonthlyExpense:N2} TL olup sağlık skorunuz {metrics.FinancialHealthScore}/100'dür.";

        return new AIConversationSummaryDto
        {
            SummaryText = summaryText,
            FinancialHealthScore = metrics.FinancialHealthScore,
            RiskLevel = metrics.RiskLevel,
            TopRecommendation = "Aylık tasarruf oranınızı %20 seviyesinin üzerinde tutmaya odaklanın.",
            GeneratedAt = DateTime.UtcNow
        };
    }

    public async Task<IEnumerable<AIAdviceDto>> GenerateRiskAnalysisAsync(
        string userId,
        DashboardDto dashboard,
        FinancialHealthDto health,
        ForecastDto forecast)
    {
        var metricsResult = await _financialEngineService.CalculateCoreMetricsAsync(userId);
        var metrics = metricsResult.Data ?? new DTOs.FinancialEngine.FinancialCoreMetricsDto();

        var list = new List<AIAdviceDto>();

        if (metrics.NetSavings < 0)
        {
            list.Add(new AIAdviceDto
            {
                Title = "Nakit Açığı Riski",
                Message = $"Bu ay gideriniz gelirinizi {Math.Abs(metrics.NetSavings):N2} TL aşıyor.",
                Category = "Risk Analizi",
                Priority = "High",
                Type = "Critical"
            });
        }
        else
        {
            list.Add(new AIAdviceDto
            {
                Title = "Düşük Finansal Risk",
                Message = "Önümüzdeki dönem için tespit edilen yüksek bir finansal risk bulunmamaktadır.",
                Category = "Risk Analizi",
                Priority = "Low",
                Type = "Success"
            });
        }

        return list;
    }

    public async Task<IEnumerable<AIAdviceDto>> GenerateOpportunitiesAsync(
        string userId,
        DashboardDto dashboard,
        FinancialHealthDto health,
        ForecastDto forecast)
    {
        var metricsResult = await _financialEngineService.CalculateCoreMetricsAsync(userId);
        var metrics = metricsResult.Data ?? new DTOs.FinancialEngine.FinancialCoreMetricsDto();

        var list = new List<AIAdviceDto>();

        if (metrics.TotalMonthlySubscriptionCost > 0)
        {
            list.Add(new AIAdviceDto
            {
                Title = "Abonelik Optimizasyon Fırsatı",
                Message = $"Aylık {metrics.TotalMonthlySubscriptionCost:N2} TL abonelik giderinizi gözden geçirerek sabit masraflarınızı düşürebilirsiniz.",
                Category = "Fırsatlar",
                Priority = "Medium",
                Type = "Info"
            });
        }

        return list;
    }

    public async Task<AIChatResponseDto> ProcessChatPromptAsync(
        string userId,
        string prompt,
        DashboardDto dashboard,
        FinancialHealthDto health,
        ForecastDto forecast)
    {
        var metricsResult = await _financialEngineService.CalculateCoreMetricsAsync(userId);
        var metrics = metricsResult.Data ?? new DTOs.FinancialEngine.FinancialCoreMetricsDto();

        var q = (prompt ?? string.Empty).ToLowerInvariant().Trim();
        var sb = new StringBuilder();
        var category = "Finansal Analiz & Tavsiye";

        var income = metrics.MonthlyIncome;
        var expense = metrics.MonthlyExpense;
        var net = metrics.NetSavings;
        var savingsRate = metrics.SavingsRate;
        var score = metrics.FinancialHealthScore;
        var portVal = metrics.TotalPortfolioValue;

        if (q.Contains("kredi kart") || q.Contains("borç") || q.Contains("faiz") || q.Contains("taksit") || q.Contains("kapatma"))
        {
            category = "Borç Yönetimi & Strateji";
            sb.AppendLine("💳 **Kredi Kartı ve Borç Azaltma Stratejiniz:**");
            sb.AppendLine();
            sb.AppendLine($"• Mevcut aylık geliriniz: **{income:N2} TL**, aylık gideriniz: **{expense:N2} TL**.");
            if (net > 0)
            {
                sb.AppendLine($"• Her ay oluşan **{net:N2} TL** pozitif nakit akışınızı doğrudan borç kapatmaya yönlendirmenizi öneririm.");
            }
        }
        else if (q.Contains("yatırım") || q.Contains("hisse") || q.Contains("kripto") || q.Contains("altın") || q.Contains("portföy"))
        {
            category = "Yatırım & Portföy Danışmanlığı";
            sb.AppendLine("📈 **Portföy ve Yatırım Analiziniz:**");
            sb.AppendLine();
            sb.AppendLine($"• Mevcut Portföy Büyüklüğünüz: **{portVal:N2} TL**.");
            sb.AppendLine($"• Aylık Tasarruf Oranınız: **%{savingsRate:N0}**.");
        }
        else
        {
            category = "Finansal Asistan Tavsiyesi";
            sb.AppendLine($"🤖 **Sorduğunuz Soru:** *\"{prompt}\"*");
            sb.AppendLine();
            sb.AppendLine("Finansal kayıtlarınızı Merkezi Finans Motoru üzerinden inceledim:");
            sb.AppendLine($"• Aylık Gelir: **{income:N2} TL** | Gider: **{expense:N2} TL** | Net Bakiye: **{net:N2} TL**.");
            sb.AppendLine($"• Finansal Sağlık Skorunuz: **{score}/100** ({metrics.RiskLevel}).");
            sb.AppendLine($"• Portföy Büyüklüğünüz: **{portVal:N2} TL**.");
        }

        return new AIChatResponseDto
        {
            Answer = sb.ToString(),
            Category = category,
            ProviderUsed = ProviderName,
            RespondedAt = DateTime.UtcNow
        };
    }
}
