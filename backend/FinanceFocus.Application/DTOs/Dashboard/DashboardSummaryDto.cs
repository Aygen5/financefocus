namespace FinanceFocus.Application.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public decimal TotalBalance { get; set; }
    public decimal MonthlyIncome { get; set; }
    public decimal MonthlyExpense { get; set; }
    public decimal NetSavings { get; set; }
    public decimal SavingsRate { get; set; }

    public int ActiveGoalCount { get; set; }
    public int CompletedGoalCount { get; set; }
    public decimal AverageGoalProgressPercentage { get; set; }

    public decimal PortfolioTotalInvestment { get; set; }
    public decimal PortfolioCurrentValue { get; set; }
    public decimal PortfolioTotalProfitLoss { get; set; }
    public decimal PortfolioTotalProfitLossPercentage { get; set; }

    public int ActiveSubscriptionCount { get; set; }
    public decimal MonthlyTotalSubscriptionCost { get; set; }
    public int UpcomingPaymentsCount { get; set; }

    public int UnreadNotificationCount { get; set; }
    public int TotalActivityCount { get; set; }
}
