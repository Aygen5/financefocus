using System;

namespace FinanceFocus.Application.DTOs.Budgets;

public class BudgetDto
{
    public string Id { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Limit { get; set; }
    public decimal SpentAmount { get; set; }
    public DateTime Month { get; set; }
    public string UserId { get; set; } = string.Empty;
}
