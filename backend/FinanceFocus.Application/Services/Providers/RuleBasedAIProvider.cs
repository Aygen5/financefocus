using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.Dashboard;
using FinanceFocus.Application.DTOs.FinancialHealth;
using FinanceFocus.Application.DTOs.Forecast;
using FinanceFocus.Application.Interfaces;

namespace FinanceFocus.Application.Services.Providers;

public class RuleBasedAIProvider : IAIProvider
{
    public string ProviderName => "RuleBasedAIProvider";

    public Task<IEnumerable<AIAdviceDto>> GenerateAdvicesAsync(
        string userId,
        DashboardDto dashboard,
        FinancialHealthDto health,
        ForecastDto forecast)
    {
        var list = new List<AIAdviceDto>();

        var summary = dashboard.Summary;
        if (summary.MonthlyExpense > summary.MonthlyIncome && summary.MonthlyIncome > 0)
        {
            list.Add(new AIAdviceDto
            {
                Title = "Bütçe Dengesi Kurulamadı",
                Message = $"Bu ayki harcamalarınız ({summary.MonthlyExpense:N2} TL) gelirinizden ({summary.MonthlyIncome:N2} TL) fazla.",
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

        if (summary.SavingsRate < 20m)
        {
            list.Add(new AIAdviceDto
            {
                Title = "Tasarruf Potansiyeli",
                Message = "Market harcamalarınızı %10 azaltmanız finansal sağlık skorunuzu yükseltebilir.",
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
                Message = $"Aylık %{summary.SavingsRate:N0} tasarruf oranınız finansal disiplininizin yüksek olduğunu gösteriyor.",
                Category = "Tasarruf Tavsiyesi",
                Priority = "Low",
                Type = "Success"
            });
        }

        var exceededBudget = dashboard.Budgets.FirstOrDefault(b => b.SpentAmount >= b.Limit * 0.8m);
        if (exceededBudget != null)
        {
            list.Add(new AIAdviceDto
            {
                Title = "Kritik Bütçe Uyarısı",
                Message = $"{exceededBudget.Category} bütçenizin %{((exceededBudget.SpentAmount / exceededBudget.Limit) * 100m):N0}'ini harcadınız.",
                Category = "Bütçe Uyarıları",
                Priority = "High",
                Type = "Warning"
            });
        }

        var upcomingRenewals = forecast.Subscriptions?.UpcomingRenewalsIn30Days?.ToList() ?? new List<DTOs.Subscriptions.SubscriptionDto>();
        if (upcomingRenewals.Any())
        {
            list.Add(new AIAdviceDto
            {
                Title = "Yaklaşan Abonelik Yenilemeleri",
                Message = "7 gün içinde yenilenecek abonelikleriniz bulunuyor.",
                Category = "Yaklaşan Abonelikler",
                Priority = "Medium",
                Type = "Info"
            });
        }

        list.Add(new AIAdviceDto
        {
            Title = "Finansal Sağlık Yorumu",
            Message = $"Finansal sağlık skorunuz 100 üzerinden {health.FinancialHealthScore} ({health.RiskLevel} risk seviyesi).",
            Category = "Finansal Sağlık Yorumu",
            Priority = health.FinancialHealthScore < 50 ? "High" : "Low",
            Type = health.FinancialHealthScore < 50 ? "Warning" : "Success"
        });

        var firstGoalForecast = forecast.Goals?.FirstOrDefault();
        if (firstGoalForecast != null)
        {
            list.Add(new AIAdviceDto
            {
                Title = "Hedef Tamamlama Analizi",
                Message = firstGoalForecast.Recommendation,
                Category = "Hedef Tamamlama Önerileri",
                Priority = "Medium",
                Type = "Info"
            });
        }

        if (dashboard.Portfolio != null && dashboard.Portfolio.TotalInvestment > 0)
        {
            var isProfit = dashboard.Portfolio.TotalProfitLoss >= 0;
            list.Add(new AIAdviceDto
            {
                Title = "Portföy Performansı",
                Message = isProfit ? "Portföyünüz pozitif performans gösteriyor." : "Portföyünüzde kısa vadeli geri çekilme gözleniyor.",
                Category = "Portföy Yorumu",
                Priority = "Medium",
                Type = isProfit ? "Success" : "Warning"
            });
        }

        return Task.FromResult<IEnumerable<AIAdviceDto>>(list);
    }

    public Task<AIConversationSummaryDto> GenerateSummaryAsync(
        string userId,
        DashboardDto dashboard,
        FinancialHealthDto health,
        ForecastDto forecast)
    {
        var summaryText = $"Finansal durumunuz {health.RiskLevel} seviyesindedir. Sağlık skorunuz {health.FinancialHealthScore}/100 olup, gelecekteki 12 aylık tahmini portföy değeriniz {forecast.Portfolio.ExpectedPortfolioValueIn12Months:N2} TL olarak öngörülmektedir.";
        var topRec = forecast.Goals.FirstOrDefault()?.Recommendation ?? "Aylık tasarruf oranınızı %20 seviyesine çıkarmaya odaklanın.";

        var dto = new AIConversationSummaryDto
        {
            SummaryText = summaryText,
            FinancialHealthScore = health.FinancialHealthScore,
            RiskLevel = health.RiskLevel,
            TopRecommendation = topRec,
            GeneratedAt = DateTime.UtcNow
        };

        return Task.FromResult(dto);
    }

    public Task<IEnumerable<AIAdviceDto>> GenerateRiskAnalysisAsync(
        string userId,
        DashboardDto dashboard,
        FinancialHealthDto health,
        ForecastDto forecast)
    {
        var list = new List<AIAdviceDto>();

        if (forecast.CashFlow.EstimatedMonthlySavings < 0)
        {
            list.Add(new AIAdviceDto
            {
                Title = "Önümüzdeki Ay Nakit Açığı Riski",
                Message = $"Bu ay tahmini gideriniz gelirinizi {Math.Abs(forecast.CashFlow.EstimatedMonthlySavings):N2} TL aşıyor.",
                Category = "Gelecek Ay Risk Analizi",
                Priority = "High",
                Type = "Critical"
            });
        }

        var highRiskBudget = forecast.Budgets.FirstOrDefault(b => b.RiskLevel == "High");
        if (highRiskBudget != null)
        {
            list.Add(new AIAdviceDto
            {
                Title = "Bütçe Aşım Riski",
                Message = $"{highRiskBudget.Category} bütçesini ay bitmeden aşma olasılığınız %{highRiskBudget.ExceedProbabilityPercentage:N0}.",
                Category = "Gelecek Ay Risk Analizi",
                Priority = "High",
                Type = "Warning"
            });
        }

        if (!list.Any())
        {
            list.Add(new AIAdviceDto
            {
                Title = "Düşük Finansal Risk",
                Message = "Önümüzdeki dönem için tespit edilen yüksek bir finansal risk bulunmamaktadır.",
                Category = "Gelecek Ay Risk Analizi",
                Priority = "Low",
                Type = "Success"
            });
        }

        return Task.FromResult<IEnumerable<AIAdviceDto>>(list);
    }

    public Task<IEnumerable<AIAdviceDto>> GenerateOpportunitiesAsync(
        string userId,
        DashboardDto dashboard,
        FinancialHealthDto health,
        ForecastDto forecast)
    {
        var list = new List<AIAdviceDto>();

        list.Add(new AIAdviceDto
        {
            Title = "Abonelik Optimizasyon Fırsatı",
            Message = $"Aylık {dashboard.Subscriptions.TotalMonthlyCost:N2} TL abonelik giderinizi gözden geçirerek sabit masraflarınızı düşürebilirsiniz.",
            Category = "Öncelikli Yapılması Gerekenler",
            Priority = "Medium",
            Type = "Info"
        });

        if (forecast.CashFlow.EstimatedMonthlySavings > 0)
        {
            list.Add(new AIAdviceDto
            {
                Title = "Yatırım Çeşitlendirme Fırsatı",
                Message = $"Aylık tahmini {forecast.CashFlow.EstimatedMonthlySavings:N2} TL tasarrufunuzu portföyünüze aktararak bileşik getiri sağlayabilirsiniz.",
                Category = "Öncelikli Yapılması Gerekenler",
                Priority = "High",
                Type = "Success"
            });
        }

        return Task.FromResult<IEnumerable<AIAdviceDto>>(list);
    }
}
