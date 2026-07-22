namespace FinanceFocus.Application.DTOs.Budgets;

public class UpdateBudgetDto
{
    public string Category { get; set; } = string.Empty;
    public decimal Limit { get; set; }
}
