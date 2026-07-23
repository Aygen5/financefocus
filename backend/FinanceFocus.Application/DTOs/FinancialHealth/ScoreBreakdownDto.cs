namespace FinanceFocus.Application.DTOs.FinancialHealth;

public class ScoreBreakdownDto
{
    public decimal TotalScore { get; set; }
    public decimal IncomeExpenseScore { get; set; }
    public decimal SavingsRateScore { get; set; }
    public decimal BudgetAdherenceScore { get; set; }
    public decimal GoalProgressScore { get; set; }
    public decimal SubscriptionOverheadScore { get; set; }
    public decimal PortfolioSizeScore { get; set; }
    public decimal PortfolioProfitabilityScore { get; set; }
}
