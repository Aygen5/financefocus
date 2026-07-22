using System;

namespace FinanceFocus.Application.DTOs.Budgets;

public class CreateBudgetDto
{
    public string Category { get; set; } = string.Empty;
    public decimal Limit { get; set; }
    public DateTime Month { get; set; }
}
