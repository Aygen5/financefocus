using System;

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

        bool isAnalytical = q.Contains("analiz") ||
                           q.Contains("oner") ||
                           q.Contains("tavsiye") ||
                           q.Contains("nasil") ||
                           q.Contains("iyilestir") ||
                           q.Contains("yorumla") ||
                           q.Contains("degerlendir") ||
                           q.Contains("strateji") ||
                           q.Contains("yol haritasi") ||
                           q.Contains("risk") ||
                           q.Contains("potansiyel");

        if (q.Contains("portfoy") || q.Contains("varlik"))
        {
            return isAnalytical ? AIIntentType.AnalysisPortfolio : AIIntentType.FactPortfolio;
        }

        if (q.Contains("butce"))
        {
            return isAnalytical ? AIIntentType.RecommendationSavings : AIIntentType.AnalysisSpending;
        }

        if (q.Contains("abonelik") || q.Contains("sabit gider"))
        {
            return isAnalytical ? AIIntentType.AnalysisSpending : AIIntentType.FactSubscriptions;
        }

        if (q.Contains("saglik") || q.Contains("skor") || q.Contains("puan") || q.Contains("risk"))
        {
            return isAnalytical ? AIIntentType.GeneralAdvisory : AIIntentType.FactHealthScore;
        }

        if (q.Contains("tasarruf"))
        {
            return isAnalytical ? AIIntentType.RecommendationSavings : AIIntentType.FactSavings;
        }

        if (q.Contains("gider") || q.Contains("harcama") || q.Contains("masraf"))
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
        return input.ToLowerInvariant()
            .Replace("ö", "o")
            .Replace("ü", "u")
            .Replace("ş", "s")
            .Replace("ç", "c")
            .Replace("ı", "i")
            .Replace("ğ", "g")
            .Replace("İ", "i")
            .Trim();
    }
}
