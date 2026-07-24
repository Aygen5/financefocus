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

        list.Add(new AIAdviceDto
        {
            Title = "Finansal Sağlık Yorumu",
            Message = $"Finansal sağlık skorunuz 100 üzerinden {health.FinancialHealthScore} ({health.RiskLevel} risk seviyesi).",
            Category = "Finansal Sağlık Yorumu",
            Priority = health.FinancialHealthScore < 50 ? "High" : "Low",
            Type = health.FinancialHealthScore < 50 ? "Warning" : "Success"
        });

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
        else
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

        return Task.FromResult<IEnumerable<AIAdviceDto>>(list);
    }

    public Task<AIChatResponseDto> ProcessChatPromptAsync(
        string userId,
        string prompt,
        DashboardDto dashboard,
        FinancialHealthDto health,
        ForecastDto forecast)
    {
        var q = (prompt ?? string.Empty).ToLowerInvariant().Trim();
        var sb = new StringBuilder();
        var category = "Finansal Analiz & Tavsiye";

        var income = dashboard.Summary?.MonthlyIncome ?? 0m;
        var expense = dashboard.Summary?.MonthlyExpense ?? 0m;
        var net = income - expense;
        var savingsRate = dashboard.Summary?.SavingsRate ?? 0m;
        var score = health.FinancialHealthScore;
        var portVal = dashboard.Portfolio?.TotalCurrentValue ?? 0m;

        if (q.Contains("kredi kart") || q.Contains("borç") || q.Contains("faiz") || q.Contains("taksit") || q.Contains("kapatma"))
        {
            category = "Borç Yönetimi & Strateji";
            sb.AppendLine("💳 **Kredi Kartı ve Borç Azaltma Stratejiniz:**");
            sb.AppendLine();
            sb.AppendLine($"• Mevcut aylık geliriniz: **{income:N2} TL**, aylık gideriniz: **{expense:N2} TL**.");
            
            if (net > 0)
            {
                sb.AppendLine($"• Her ay oluşan **{net:N2} TL** pozitif nakit akışınızı doğrudan borç kapatmaya yönlendirmenizi öneririm.");
                sb.AppendLine("• **Çığ Yöntemi (Avalanche):** En yüksek faiz oranına sahip karttan başlayarak ödeme yapın.");
            }
            else
            {
                sb.AppendLine($"• Bu ay **{Math.Abs(net):N2} TL** bütçe açığınız bulunmaktadır. Öncelikle zorunlu olmayan değişken harcamaları kısarak kart asgari tutarından fazlasını ödemelisiniz.");
            }
            sb.AppendLine("• Ekstra taksitlendirmeleri durdurun ve kart limitinizi aylık gelirinizin %50'si ile sınırlandırın.");
        }
        else if (q.Contains("yatırım") || q.Contains("hisse") || q.Contains("kripto") || q.Contains("altın") || q.Contains("portföy"))
        {
            category = "Yatırım & Portföy Danışmanlığı";
            sb.AppendLine("📈 **Portföy ve Yatırım Analiziniz:**");
            sb.AppendLine();
            sb.AppendLine($"• Mevcut Portföy Büyüklüğünüz: **{portVal:N2} TL**.");
            sb.AppendLine($"• Aylık Tasarruf Oranınız: **%{savingsRate:N0}**.");
            
            if (savingsRate >= 20m)
            {
                sb.AppendLine("• Tasarruf oranınız mükemmel! Birikimlerinizi enflasyona karşı korumak için 3 parçalı sepet uygulayın: %40 Altın/Emtia, %40 Hisse/Fon, %20 Likit/Kripto.");
            }
            else
            {
                sb.AppendLine($"• Tasarruf oranınız (%{savingsRate:N0}) henüz hedeflenen %20 seviyesinin altında. Yatırıma büyük tutarlar ayırmadan önce 3 aylık acil durum fonu oluşturmalısınız.");
            }
        }
        else if (q.Contains("fazla") || q.Contains("harcadım") || q.Contains("kategori") || q.Contains("nerede"))
        {
            category = "Harcama Analizi";
            sb.AppendLine("🔍 **Aylık Harcama Dağılımınız:**");
            sb.AppendLine();
            
            var topBudget = dashboard.Budgets.OrderByDescending(b => b.SpentAmount).FirstOrDefault();
            if (topBudget != null)
            {
                sb.AppendLine($"• En yüksek harcama yaptığınız kategori: **{topBudget.Category}** (Toplam Harcama: **{topBudget.SpentAmount:N2} TL**, Limit: **{topBudget.Limit:N2} TL**).");
                sb.AppendLine($"• Bu kategoride bütçe kullanım oranınız: **%{((topBudget.SpentAmount / (topBudget.Limit > 0 ? topBudget.Limit : 1)) * 100m):N0}**.");
            }
            else
            {
                sb.AppendLine($"• Toplam aylık harcamanız **{expense:N2} TL** olarak gerçekleşti.");
            }
            
            if (dashboard.Subscriptions.TotalMonthlyCost > 0)
            {
                sb.AppendLine($"• Aylık sabit abonelik yükünüz **{dashboard.Subscriptions.TotalMonthlyCost:N2} TL**.");
            }
        }
        else if (q.Contains("bütçe") || q.Contains("limit") || q.Contains("iyileştir"))
        {
            category = "Bütçe İyileştirme Planı";
            sb.AppendLine("🎯 **Bütçe Optimizasyon Önerileri:**");
            sb.AppendLine();
            sb.AppendLine($"• Mevcut Aylık Gelir: **{income:N2} TL** | Harcama: **{expense:N2} TL**.");
            sb.AppendLine("• 50/30/20 kuralını uygulayın: %50 Temel İhtiyaçlar (Kira/Faturalar), %30 Kişisel İstekler, %20 Yatırım & Tasarruf.");
            
            var highestOverhead = dashboard.Budgets.FirstOrDefault(b => b.SpentAmount > b.Limit);
            if (highestOverhead != null)
            {
                sb.AppendLine($"• **Dikkat:** {highestOverhead.Category} kategorisinde bütçe limitinizi aştınız. Önümüzdeki ay bu kategorinin limitini %15 artırabilir veya harcamayı dizginleyebilirsiniz.");
            }
        }
        else if (q.Contains("tasarruf") || q.Contains("birikim") || q.Contains("acil durum"))
        {
            category = "Tasarruf Önerileri";
            sb.AppendLine("💡 **Kişiselleştirilmiş Tasarruf Tavsiyeleri:**");
            sb.AppendLine();
            sb.AppendLine($"• Mevcut Tasarruf Oranınız: **%{savingsRate:N0}**.");
            
            if (net > 0)
            {
                sb.AppendLine($"• Aylık **{net:N2} TL** tutarındaki kullanılabilir bakiyenizi otomatik virman ile ayın ilk günü birikim hesabına aktarın.");
            }
            sb.AppendLine($"• Aboneliklerinizi gözden geçirerek aylık **{dashboard.Subscriptions.TotalMonthlyCost:N2} TL** sabiti optimize edebilirsiniz.");
        }
        else if (q.Contains("önümüzdeki ay") || q.Contains("tahmin") || q.Contains("gelecek"))
        {
            category = "Gelecek Ay Tahmini";
            sb.AppendLine("🔮 **Önümüzdeki Ay Finansal Öngörüsü:**");
            sb.AppendLine();
            sb.AppendLine($"• Tahmini Gelir: **{forecast.CashFlow.EstimatedMonthlyIncome:N2} TL**.");
            sb.AppendLine($"• Tahmini Gider: **{forecast.CashFlow.EstimatedMonthlyExpense:N2} TL**.");
            sb.AppendLine($"• Tahmini Dönem Sonu Net Tasarruf: **{forecast.CashFlow.EstimatedMonthlySavings:N2} TL**.");
            sb.AppendLine($"• 12 Ay Sonraki Beklenen Portföy Değeri: **{forecast.Portfolio.ExpectedPortfolioValueIn12Months:N2} TL**.");
        }
        else if (q.Contains("sağlık") || q.Contains("skor") || q.Contains("durum"))
        {
            category = "Finansal Sağlık Analizi";
            sb.AppendLine("🏥 **Finansal Sağlık Raporunuz:**");
            sb.AppendLine();
            sb.AppendLine($"• Finansal Sağlık Skorunuz: **{score} / 100** ({health.RiskLevel} Risk Grubu).");
            sb.AppendLine($"• Gelir/Gider Dengesi Skoru: **{health.ScoreBreakdown.IncomeExpenseScore:N1} / 25**.");
            sb.AppendLine($"• Bütçe Uyum Skoru: **{health.ScoreBreakdown.BudgetAdherenceScore:N1} / 20**.");
            sb.AppendLine($"• Tasarruf Oranı Skoru: **{health.ScoreBreakdown.SavingsRateScore:N1} / 20**.");
        }
        else
        {
            category = "Finansal Asistan Tavsiyesi";
            sb.AppendLine($"🤖 **Sorduğunuz Soru:** *\"{prompt}\"*");
            sb.AppendLine();
            sb.AppendLine($"Finansal kayıtlarınızı inceledim. Güncel durum özetiniz:");
            sb.AppendLine($"• Aylık Gelir: **{income:N2} TL** | Gider: **{expense:N2} TL** | Net Bakiye: **{net:N2} TL**.");
            sb.AppendLine($"• Finansal Sağlık Skorunuz: **{score}/100** ({health.RiskLevel}).");
            sb.AppendLine($"• Portföy Büyüklüğünüz: **{portVal:N2} TL**.");
            sb.AppendLine();
            sb.AppendLine("Finansal sağlığınızı korumak için gelir-gider dengesini sürekli pozitif tutmanızı ve bütçe limitlerine sadık kalmanızı tavsiye ederim.");
        }

        var response = new AIChatResponseDto
        {
            Answer = sb.ToString(),
            Category = category,
            ProviderUsed = ProviderName,
            RespondedAt = DateTime.UtcNow
        };

        return Task.FromResult(response);
    }
}
