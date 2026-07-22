using System.Collections.Generic;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.DTOs.Transactions;

namespace FinanceFocus.Application.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public decimal TotalBalance { get; set; }
    public decimal MonthlyIncome { get; set; }
    public decimal MonthlyExpense { get; set; }
    public decimal NetSavings { get; set; }
    public IEnumerable<TransactionDto> RecentTransactions { get; set; } = new List<TransactionDto>();
    public IEnumerable<BudgetDto> ActiveBudgets { get; set; } = new List<BudgetDto>();
    public IEnumerable<GoalDto> TopGoals { get; set; } = new List<GoalDto>();
}
