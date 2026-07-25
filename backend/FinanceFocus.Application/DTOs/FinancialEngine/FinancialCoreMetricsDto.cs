using System;
using System.Collections.Generic;

namespace FinanceFocus.Application.DTOs.FinancialEngine;

public class CashFlowMonthDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Income { get; set; }
    public decimal Expense { get; set; }
}

public class CategorySpendingDto
{
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Limit { get; set; }
    public double Percentage { get; set; }
}

public class FinancialCoreMetricsDto
{
    public decimal TotalBalance { get; set; }
    public decimal MonthlyIncome { get; set; }
    public decimal MonthlyExpense { get; set; }
    public decimal NetSavings { get; set; }
    public decimal SavingsRate { get; set; }
    public decimal IncomeToExpenseRatio { get; set; }
    public decimal TotalPortfolioValue { get; set; }
    public decimal TotalPortfolioInvestment { get; set; }
    public decimal TotalPortfolioProfitLoss { get; set; }
    public double TotalPortfolioProfitLossPercentage { get; set; }
    public decimal TotalMonthlySubscriptionCost { get; set; }
    public decimal SubscriptionToIncomePercentage { get; set; }
    public int ActiveSubscriptionCount { get; set; }
    public string MostExpensiveSubscriptionName { get; set; } = "Yok";
    public decimal MostExpensiveSubscriptionPrice { get; set; }
    public int FinancialHealthScore { get; set; }
    public string RiskLevel { get; set; } = "Moderate";
    public string LargestSpendingCategory { get; set; } = "Yok";
    public decimal LargestSpendingAmount { get; set; }
    public int OverBudgetCategoryCount { get; set; }
    public List<CashFlowMonthDto> CashFlowHistory { get; set; } = new List<CashFlowMonthDto>();
    public List<CategorySpendingDto> CategoryExpenses { get; set; } = new List<CategorySpendingDto>();
    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;
}
