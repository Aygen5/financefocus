using System;

namespace FinanceFocus.Application.DTOs.FinancialHealth;

public class FinancialHealthDto
{
    public int Score { get; set; }
    public string Status { get; set; } = "Fair";
    public decimal SavingsRate { get; set; }
    public decimal DebtRatio { get; set; }
    public decimal BudgetDiscipline { get; set; }
    public DateTime CalculationDate { get; set; }
}
