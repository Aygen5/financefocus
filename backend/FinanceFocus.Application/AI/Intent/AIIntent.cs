namespace FinanceFocus.Application.AI.Intent;

public enum AIIntentType
{
    FactIncome,
    FactExpense,
    FactSavings,
    FactPortfolio,
    FactSubscriptions,
    FactHealthScore,
    AnalysisSpending,
    AnalysisPortfolio,
    RecommendationSavings,
    GeneralAdvisory
}

public interface IAIIntentClassifier
{
    AIIntentType Classify(string prompt);
}
