using System;

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

        if (q.Contains("gelirim giderim") || (q.Contains("gelir") && q.Contains("gider") && (q.Contains("kati") || q.Contains("orani") || q.Contains("karsilastir"))))
        {
            return AIIntentType.ExpenseComparisonQuestion;
        }

        if (q.Contains("tasarruf oran") || (q.Contains("tasarruf") && (q.Contains("iyi mi") || q.Contains("nasil") || q.Contains("orani"))))
        {
            return AIIntentType.SavingsRateQuestion;
        }

        if (q.Contains("abone") && (q.Contains("azalt") || q.Contains("iptal") || q.Contains("fazla mi") || q.Contains("cok mu")))
        {
            return AIIntentType.SubscriptionAnalysisQuestion;
        }

        if (q.Contains("abone") && (q.Contains("pahal") || q.Contains("yuksek") || q.Contains("hangisi") || q.Contains("en")))
        {
            return AIIntentType.SubscriptionQuestion;
        }

        if ((q.Contains("kategori") || q.Contains("harcadim") || q.Contains("market") || q.Contains("gida") || q.Contains("gider")) && (q.Contains("en") || q.Contains("fazla") || q.Contains("yuksek") || q.Contains("cok")))
        {
            if (!q.Contains("analiz") && !q.Contains("yorum") && !q.Contains("oner"))
            {
                return AIIntentType.LargestExpenseQuestion;
            }
        }

        if (q.Contains("portf") || q.Contains("varlik"))
        {
            if (q.Contains("yorum") || q.Contains("analiz") || q.Contains("degerlen") || q.Contains("nasil"))
            {
                return AIIntentType.PortfolioAnalysisQuestion;
            }
            return AIIntentType.PortfolioValueQuestion;
        }

        if (q.Contains("risk") || q.Contains("saglik") || q.Contains("skor"))
        {
            return AIIntentType.RiskQuestion;
        }

        if (q.Contains("tasarr"))
        {
            if (q.Contains("net") || q.Contains("kac") || q.Contains("ne kadar"))
            {
                return AIIntentType.SavingsQuestion;
            }
            return AIIntentType.BudgetAdviceQuestion;
        }

        if (q.Contains("gider") || q.Contains("harca"))
        {
            if (q.Contains("analiz") || q.Contains("yorum") || q.Contains("nasil") || q.Contains("tekrar"))
            {
                return AIIntentType.BudgetAdviceQuestion;
            }
            return AIIntentType.ExpenseQuestion;
        }

        if (q.Contains("gelir"))
        {
            if (q.Contains("analiz") || q.Contains("yorum"))
            {
                return AIIntentType.BudgetAdviceQuestion;
            }
            return AIIntentType.IncomeQuestion;
        }

        if (q.Contains("analiz") || q.Contains("yorum") || q.Contains("oner") || q.Contains("iyilestir") || q.Contains("tekrar"))
        {
            return AIIntentType.BudgetAdviceQuestion;
        }

        return AIIntentType.GeneralConversation;
    }

    private static string Normalize(string input)
    {
        var raw = input.ToLowerInvariant()
            .Replace("Ã¶", "o").Replace("Ã¼", "u").Replace("ÅŸ", "s").Replace("Ã§", "c").Replace("Ä±", "i").Replace("ÄŸ", "g")
            .Replace("ö", "o").Replace("ü", "u").Replace("ş", "s").Replace("ç", "c").Replace("ı", "i").Replace("ğ", "g").Replace("i̇", "i");

        var sb = new System.Text.StringBuilder();
        foreach (char c in raw)
        {
            if (c >= 'a' && c <= 'z' || c >= '0' && c <= '9' || c == ' ')
                sb.Append(c);
            else
                sb.Append(' ');
        }
        return sb.ToString().Trim();
    }
}
