using System;
using FinanceFocus.Domain.Common;

namespace FinanceFocus.Domain.Entities;

/// <summary>
/// Forecast Engine tarafından hesaplanan tahmin geçmişlerini saklayan varlık sınıfı.
/// </summary>
public class ForecastHistory : BaseEntity
{
    public DateTime ForecastDate { get; set; } = DateTime.UtcNow;
    public decimal ProjectedIncome { get; set; }
    public decimal ProjectedExpense { get; set; }
    public decimal ProjectedSavings { get; set; }
    public string AlgorithmUsed { get; set; } = "SMA";
    public string UserId { get; set; } = string.Empty;
}
