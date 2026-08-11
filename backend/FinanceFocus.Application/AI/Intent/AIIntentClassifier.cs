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

        if (q.Contains("abone"))
        {
            if (q.Contains("en pahali") || q.Contains("en yuksek") || q.Contains("en fazla") || q.Contains("hangisi"))
            {
                return AIIntentType.SubscriptionQuestion;
            }
            if (q.Contains("azalt") || q.Contains("iptal") || q.Contains("maliyet") || q.Contains("toplam") || q.Contains("tutar") || q.Contains("ne kadar") || q.Contains("kac") || q.Contains("gider") || q.Contains("ucret"))
            {
                return AIIntentType.SubscriptionAnalysisQuestion;
            }
            return AIIntentType.SubscriptionQuestion;
        }

        if (q.Contains("gelirim giderim") || (q.Contains("gelir") && q.Contains("gider") && (q.Contains("kat") || q.Contains("oran") || q.Contains("karsilastir") || q.Contains("fazla"))))
        {
            return AIIntentType.ExpenseComparisonQuestion;
        }

        if (q.Contains("tasarruf oran") || (q.Contains("tasarruf") && (q.Contains("iyi mi") || q.Contains("orani") || q.Contains("nasil"))))
        {
            return AIIntentType.SavingsRateQuestion;
        }

        if (q.Contains("en cok hangi") || q.Contains("en yuksek harcama") || q.Contains("en pahali kategori"))
        {
            return AIIntentType.LargestExpenseQuestion;
        }

        if (q.Contains("portf") || q.Contains("varlik"))
        {
            if (q.Contains("yorum") || q.Contains("analiz") || q.Contains("degerlen") || q.Contains("nasil") || q.Contains("durum"))
            {
                return AIIntentType.PortfolioAnalysisQuestion;
            }
            return AIIntentType.PortfolioValueQuestion;
        }

        if (q.Contains("risk") || q.Contains("saglik") || q.Contains("skor") || q.Contains("durum") || q.Contains("finansal"))
        {
            return AIIntentType.RiskQuestion;
        }

        if (q.Contains("ast") || q.Contains("asild") || q.Contains("asmi") || q.Contains("astik") || q.Contains("limiti as") ||
            q.Contains("iyilest") || q.Contains("iyile") || q.Contains("oner") || q.Contains("tavsiye") || q.Contains("nerede") || q.Contains("fazla") ||
            q.Contains("butc") || q.Contains("market") || q.Contains("kategori"))
        {
            if (!q.Contains("en pahali") && !q.Contains("en yuksek harcama") && !q.Contains("en cok hangi"))
            {
                return AIIntentType.BudgetAdviceQuestion;
            }
        }

        if (q.Contains("tasarr"))
        {
            if (q.Contains("net") || q.Contains("kac") || q.Contains("ne kadar"))
            {
                return AIIntentType.SavingsQuestion;
            }
            return AIIntentType.BudgetAdviceQuestion;
        }

        if (q.Contains("gider") || q.Contains("harcama") || q.Contains("harcadim"))
        {
            if (q.Contains("analiz") || q.Contains("yorum") || q.Contains("nasil") || q.Contains("tekrar") || q.Contains("fazla"))
            {
                return AIIntentType.BudgetAdviceQuestion;
            }
            return AIIntentType.ExpenseQuestion;
        }

        if (q.Contains("gelir") || q.Contains("kazanc"))
        {
            if (q.Contains("analiz") || q.Contains("yorum"))
            {
                return AIIntentType.BudgetAdviceQuestion;
            }
            return AIIntentType.IncomeQuestion;
        }

        if (q.Contains("analiz") || q.Contains("yorum") || q.Contains("oner") || q.Contains("iyilest") || q.Contains("iyile") || q.Contains("tekrar"))
        {
            return AIIntentType.BudgetAdviceQuestion;
        }

        return AIIntentType.GeneralConversation;
    }

    private static string Normalize(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;

        var raw = input.ToLowerInvariant()
            .Replace("Ã¶", "o").Replace("Ã¼", "u").Replace("ÅŸ", "s").Replace("Ã§", "c").Replace("Ä±", "i").Replace("ÄŸ", "g")
            .Replace("ö", "o").Replace("ü", "u").Replace("ş", "s").Replace("ç", "c").Replace("ı", "i").Replace("ğ", "g").Replace("i̇", "i")
            .Replace("åş", "s").Replace("åÿ", "s").Replace("å", "s").Replace("ÿ", "").Replace("ä±", "i").Replace("äğ", "g");

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
