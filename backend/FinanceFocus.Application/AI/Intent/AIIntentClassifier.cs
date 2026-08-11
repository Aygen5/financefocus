using System;
using System.Text.RegularExpressions;

namespace FinanceFocus.Application.AI.Intent;

public class AIIntentClassifier : IAIIntentClassifier
{
    public AIIntentType Classify(string prompt)
    {
        if (string.IsNullOrWhiteSpace(prompt))
        {
            return AIIntentType.GeneralConversation;
        }

        var q = Normalize(prompt);

        if (q.Contains("merhaba") || q.Contains("selam") || q.Contains("hava nasil") || q.Contains("gunaydin") || q.Contains("iyi gunler"))
        {
            return AIIntentType.GeneralConversation;
        }

        // Subscriptions ("Aboneliklerim ne kadar", "En pahalı abonelik", "Abonelik harcamaları")
        if (q.Contains("abone"))
        {
            if (q.Contains("en pahali") || q.Contains("en yuksek") || q.Contains("en fazla") || q.Contains("hangisi"))
            {
                return AIIntentType.SubscriptionQuestion;
            }
            return AIIntentType.SubscriptionAnalysisQuestion;
        }

        // Expense Comparison ("Gelirime göre giderlerim fazla mı?", "Gelir ve gider karşılaştır")
        if (q.Contains("gelirim giderim") || (q.Contains("gelir") && q.Contains("gider")))
        {
            return AIIntentType.ExpenseComparisonQuestion;
        }

        // Savings Rate ("Tasarruf oranım nasıl?", "Tasarruf oranı")
        if (q.Contains("tasarruf oran") || (q.Contains("tasarruf") && (q.Contains("oran") || q.Contains("orani"))))
        {
            return AIIntentType.SavingsRateQuestion;
        }

        // Savings Advice ("Tasarruf önerisi oluştur", "Nasıl tasarruf ederim", "Nereden kısabilirim")
        if (q.Contains("tasarruf") && (q.Contains("oner") || q.Contains("tavsiye") || q.Contains("olustur") || q.Contains("kis") || q.Contains("artir") || q.Contains("yapabilirim")))
        {
            return AIIntentType.SavingsAdviceQuestion;
        }

        if (q.Contains("tasarr"))
        {
            if (q.Contains("net") || q.Contains("kac") || q.Contains("ne kadar"))
            {
                return AIIntentType.SavingsQuestion;
            }
            return AIIntentType.SavingsAdviceQuestion;
        }

        // Spending Analysis ("Bu ay nerede fazla harcadım?", "Harcama analizim", "En çok nereye gitti")
        if (q.Contains("nerede") || q.Contains("nerelere") || q.Contains("harcadim") || q.Contains("dokum") || (q.Contains("harcama") && (q.Contains("analiz") || q.Contains("dağılım") || q.Contains("dagilim") || q.Contains("detay"))))
        {
            return AIIntentType.SpendingAnalysisQuestion;
        }

        // Largest Expense
        if (q.Contains("en cok hangi") || q.Contains("en yuksek harcama") || q.Contains("en pahali kategori"))
        {
            return AIIntentType.LargestExpenseQuestion;
        }

        // Portfolio / Investments
        if (q.Contains("portf") || q.Contains("varlik"))
        {
            if (q.Contains("yorum") || q.Contains("analiz") || q.Contains("degerlen") || q.Contains("nasil") || q.Contains("durum"))
            {
                return AIIntentType.PortfolioAnalysisQuestion;
            }
            return AIIntentType.PortfolioValueQuestion;
        }

        // Financial Health / Risk ("Bu ay finansal durumum nasıl?", "Risk seviyem ne?")
        if (q.Contains("risk") || q.Contains("saglik") || q.Contains("skor") || (q.Contains("finansal") && q.Contains("durum")))
        {
            return AIIntentType.RiskQuestion;
        }

        // Budget Advice ("Bütçemi nasıl iyileştirebilirim?", "Bütçe önerisi")
        if (q.Contains("butc") || q.Contains("iyilest") || q.Contains("plan"))
        {
            return AIIntentType.BudgetAdviceQuestion;
        }

        if (q.Contains("gider") || q.Contains("harcama"))
        {
            return AIIntentType.ExpenseQuestion;
        }

        if (q.Contains("gelir") || q.Contains("kazanc"))
        {
            return AIIntentType.IncomeQuestion;
        }

        return AIIntentType.GeneralConversation;
    }

    private static string Normalize(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;

        var raw = input.ToLowerInvariant()
            .Replace("ö", "o").Replace("ü", "u").Replace("ş", "s").Replace("ç", "c").Replace("ı", "i").Replace("ğ", "g").Replace("i̇", "i");

        var sb = new System.Text.StringBuilder();
        foreach (char c in raw)
        {
            if (c >= 'a' && c <= 'z' || c >= '0' && c <= '9')
                sb.Append(c);
            else
                sb.Append(' ');
        }
        return Regex.Replace(sb.ToString(), @"\s+", " ").Trim();
    }
}
