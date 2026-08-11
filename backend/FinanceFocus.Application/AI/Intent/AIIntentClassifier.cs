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

        // Non-financial greetings / weather / trivia
        if (q.Contains("merhaba") || q.Contains("selam") || q.Contains("hava nasil") || q.Contains("gunaydin") || q.Contains("iyi gunler") || q.Contains("fikra") || q.Contains("en sevdigin"))
        {
            return AIIntentType.GeneralConversation;
        }

        // 1. Forecast / Future Predictions ("Önümüzdeki ay beni ne bekliyor?", "Gelecek ay tahmini")
        if (q.Contains("onumuzdeki") || q.Contains("gelecek") || q.Contains("bekliyor") || q.Contains("tahmin") || q.Contains("onumuzdeki ay"))
        {
            return AIIntentType.ForecastQuestion;
        }

        // 2. Financial Health Analysis ("Finansal sağlığımı analiz et", "Finansal durumum nasıl?", "Sağlık skorum ne?")
        if (q.Contains("saglik") || q.Contains("skor") || q.Contains("risk") || (q.Contains("finansal") && (q.Contains("analiz") || q.Contains("durum") || q.Contains("nasil"))))
        {
            return AIIntentType.FinancialHealthQuestion;
        }

        // 3. Expense Reduction ("Giderlerimi nasıl azaltabilirim?", "Harcamalarımı nasıl düşürebilirim?", "Nereden kısabilirim?")
        if ((q.Contains("gider") || q.Contains("harcama")) && (q.Contains("azalt") || q.Contains("dusur") || q.Contains("kisa") || q.Contains("kisabi")))
        {
            return AIIntentType.ExpenseReductionQuestion;
        }

        // 4. Subscriptions ("Aboneliklerime ne kadar para gidiyor?", "En pahalı aboneliğim hangisi?")
        if (q.Contains("abone"))
        {
            if (q.Contains("en pahali") || q.Contains("en yuksek") || q.Contains("en fazla") || q.Contains("hangisi"))
            {
                return AIIntentType.SubscriptionQuestion;
            }
            return AIIntentType.SubscriptionAnalysisQuestion;
        }

        // 5. Income vs Expense Comparison ("Gelirime göre giderlerim fazla mı?")
        if (q.Contains("gelirim giderim") || (q.Contains("gelir") && q.Contains("gider") && (q.Contains("kat") || q.Contains("karsilastir") || q.Contains("fazla"))))
        {
            return AIIntentType.ExpenseComparisonQuestion;
        }

        // 6. Savings Rate / Savings Amount
        if (q.Contains("tasarruf oran") || (q.Contains("tasarruf") && (q.Contains("oran") || q.Contains("orani"))))
        {
            return AIIntentType.SavingsRateQuestion;
        }

        // 7. Savings Advice ("Tasarruf önerisi oluştur", "Nasıl tasarruf ederim")
        if (q.Contains("tasarruf") && (q.Contains("oner") || q.Contains("tavsiye") || q.Contains("olustur") || q.Contains("nasil") || q.Contains("artir") || q.Contains("yapabilirim")))
        {
            return AIIntentType.SavingsAdviceQuestion;
        }

        if (q.Contains("tasarr"))
        {
            if (q.Contains("ettim") || q.Contains("net") || q.Contains("kac") || q.Contains("ne kadar"))
            {
                return AIIntentType.SavingsQuestion;
            }
            return AIIntentType.SavingsAdviceQuestion;
        }

        // 8. Largest Expense Category ("En çok hangi kategoride harcama yaptım?", "En yüksek harcama")
        if (q.Contains("en cok hangi") || q.Contains("en yuksek harcama") || q.Contains("en pahali kategori") || (q.Contains("en cok") && q.Contains("kategori")))
        {
            return AIIntentType.LargestExpenseQuestion;
        }

        // 9. Spending Analysis ("Bu ay nerede fazla harcadım?", "En çok param nereye gitmiş?", "Hangi kategoride fazla para harcadım?")
        if (q.Contains("nerede") || q.Contains("nerelere") || q.Contains("harcadim") || q.Contains("para gitt") || q.Contains("para verdim") || q.Contains("buyuk kalem") ||
            (q.Contains("harcama") && (q.Contains("analiz") || q.Contains("dagilim") || q.Contains("detay") || q.Contains("nasil") || q.Contains("kategori") || q.Contains("fazla"))))
        {
            return AIIntentType.SpendingAnalysisQuestion;
        }

        // 10. Portfolio / Investments ("Portföyümün durumu nasıl?", "Portföy değerim ne kadar?")
        if (q.Contains("portf") || q.Contains("varlik"))
        {
            if (q.Contains("yorum") || q.Contains("analiz") || q.Contains("degerlen") || q.Contains("nasil") || q.Contains("durum"))
            {
                return AIIntentType.PortfolioAnalysisQuestion;
            }
            return AIIntentType.PortfolioValueQuestion;
        }

        // 11. Budget Advice ("Bütçemi nasıl iyileştirebilirim?", "Bütçe planlaması")
        if (q.Contains("butc") || q.Contains("iyilest") || q.Contains("plan"))
        {
            return AIIntentType.BudgetAdviceQuestion;
        }

        // 12. Income / Expense basic questions
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
