namespace FinanceFocus.Application.AI.Intent;

public enum AIIntentType
{
    IncomeQuestion,
    ExpenseQuestion,
    SavingsQuestion,
    SavingsRateQuestion,
    ExpenseComparisonQuestion,
    LargestExpenseQuestion,
    PortfolioValueQuestion,
    PortfolioAnalysisQuestion,
    SubscriptionQuestion,
    SubscriptionAnalysisQuestion,
    RiskQuestion,
    BudgetAdviceQuestion,
    GeneralConversation
}

public interface IAIIntentClassifier
{
    AIIntentType Classify(string prompt);
}
