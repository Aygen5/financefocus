using System;
using FinanceFocus.Domain.Common;

namespace FinanceFocus.Domain.Entities;

/// <summary>
/// Belirli periyotlarda hesaplanan finansal sağlık skor geçmişlerini tutan varlık sınıfı.
/// </summary>
public class FinancialHealthHistory : BaseEntity
{
    public DateTime CalculationDate { get; set; } = DateTime.UtcNow;
    public int Score { get; set; }
    public string Status { get; set; } = "Fair";
    public decimal SavingsRate { get; set; }
    public decimal DebtRatio { get; set; }
    public decimal BudgetDiscipline { get; set; }
    public string UserId { get; set; } = string.Empty;
}
