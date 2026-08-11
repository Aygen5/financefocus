namespace FinanceFocus.Application.AI.Intent;

public enum AIIntentType
{
    IncomeQuestion,
    ExpenseQuestion,
    SavingsQuestion,
    SavingsRateQuestion,
    SavingsAdviceQuestion,
    SpendingAnalysisQuestion,
    ExpenseReductionQuestion,
    ExpenseComparisonQuestion,
    LargestExpenseQuestion,
    PortfolioValueQuestion,
    PortfolioAnalysisQuestion,
    SubscriptionQuestion,
    SubscriptionAnalysisQuestion,
    RiskQuestion,
    FinancialHealthQuestion,
    BudgetAdviceQuestion,
    ForecastQuestion,
    GeneralConversation
}

public interface IAIIntentClassifier
{
    AIIntentType Classify(string prompt);
}
