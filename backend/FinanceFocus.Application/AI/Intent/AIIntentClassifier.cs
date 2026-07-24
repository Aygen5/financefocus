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

        var q = prompt.ToLowerInvariant().Trim();

        bool isAnalytical = q.Contains("analiz") ||
                           q.Contains("öner") ||
                           q.Contains("tavsiye") ||
                           q.Contains("nasıl") ||
                           q.Contains("iyileştir") ||
                           q.Contains("yorumla") ||
                           q.Contains("değerlendir") ||
                           q.Contains("strateji") ||
                           q.Contains("yol haritası") ||
                           q.Contains("potansiyel");

        if (q.Contains("portföy") || q.Contains("varlık"))
        {
            return isAnalytical ? AIIntentType.AnalysisPortfolio : AIIntentType.FactPortfolio;
        }

        if (q.Contains("abonelik") || q.Contains("sabit gider"))
        {
            return isAnalytical ? AIIntentType.AnalysisSpending : AIIntentType.FactSubscriptions;
        }

        if (q.Contains("sağlık") || q.Contains("skor") || q.Contains("puan"))
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

        if (q.Contains("gelir") || q.Contains("kazanç") || q.Contains("maaş"))
        {
            return isAnalytical ? AIIntentType.AnalysisSpending : AIIntentType.FactIncome;
        }

        if (isAnalytical)
        {
            return AIIntentType.GeneralAdvisory;
        }

        return AIIntentType.GeneralAdvisory;
    }
}
