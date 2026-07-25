using System;
using System.Text.RegularExpressions;

namespace FinanceFocus.Application.AI.Intent;

public class AIIntentClassifier : IAIIntentClassifier
{
    public AIIntentType Classify(string prompt)
    {
        if (string.IsNullOrWhiteSpace(prompt))
        {
            return AIIntentType.GeneralAdvisory;
        }

        var q = Normalize(prompt);

        if (q.Contains("abone") && (q.Contains("pahal") || q.Contains("yuksek") || q.Contains("en") || q.Contains("fazla")))
        {
            return AIIntentType.FactTopSubscription;
        }

        if ((q.Contains("kategori") || q.Contains("harca") || q.Contains("gider")) && (q.Contains("en") || q.Contains("fazla") || q.Contains("yuksek") || q.Contains("cok")))
        {
            if (!q.Contains("analiz") && !q.Contains("yorum") && !q.Contains("oner"))
            {
                return AIIntentType.FactTopCategory;
            }
        }

        bool isAnalytical = q.Contains("analiz") ||
                           q.Contains("oner") ||
                           q.Contains("tavsiye") ||
                           q.Contains("nasil") ||
                           q.Contains("iyilestir") ||
                           q.Contains("yorumla") ||
                           q.Contains("degerlen") ||
                           q.Contains("strateji") ||
                           q.Contains("yol harita") ||
                           q.Contains("risk") ||
                           q.Contains("potansiyel");

        if (q.Contains("portf") || q.Contains("varlik"))
        {
            return isAnalytical ? AIIntentType.AnalysisPortfolio : AIIntentType.FactPortfolio;
        }

        if (q.Contains("butc"))
        {
            return isAnalytical ? AIIntentType.RecommendationSavings : AIIntentType.AnalysisSpending;
        }

        if (q.Contains("abone") || q.Contains("sabit gider"))
        {
            return isAnalytical ? AIIntentType.AnalysisSpending : AIIntentType.FactSubscriptions;
        }

        if (q.Contains("saglik") || q.Contains("skor") || q.Contains("puan") || q.Contains("risk"))
        {
            return isAnalytical ? AIIntentType.GeneralAdvisory : AIIntentType.FactHealthScore;
        }

        if (q.Contains("tasarr"))
        {
            return isAnalytical ? AIIntentType.RecommendationSavings : AIIntentType.FactSavings;
        }

        if (q.Contains("gider") || q.Contains("harca") || q.Contains("masraf"))
        {
            return isAnalytical ? AIIntentType.AnalysisSpending : AIIntentType.FactExpense;
        }

        if (q.Contains("gelir") || q.Contains("kazanc") || q.Contains("maas"))
        {
            return isAnalytical ? AIIntentType.AnalysisSpending : AIIntentType.FactIncome;
        }

        return AIIntentType.GeneralAdvisory;
    }

    private static string Normalize(string input)
    {
        var lower = input.ToLowerInvariant();
        var sb = new System.Text.StringBuilder();
        foreach (char c in lower)
        {
            switch (c)
            {
                case 'ö': sb.Append('o'); break;
                case 'ü': sb.Append('u'); break;
                case 'ş': sb.Append('s'); break;
                case 'ç': sb.Append('c'); break;
                case 'ı': sb.Append('i'); break;
                case 'ğ': sb.Append('g'); break;
                case 'İ': sb.Append('i'); break;
                default:
                    if (c >= 'a' && c <= 'z' || c >= '0' && c <= '9' || c == ' ')
                        sb.Append(c);
                    else
                        sb.Append(' ');
                    break;
            }
        }
        return sb.ToString().Trim();
    }
}
