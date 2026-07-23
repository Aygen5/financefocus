using System;
using FinanceFocus.Domain.Enums;

namespace FinanceFocus.Application.DTOs.Portfolio;

public class PortfolioAssetDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal PurchasePrice { get; set; }
    public decimal CurrentPrice { get; set; }
    public AssetType AssetType { get; set; }

    public decimal TotalInvestment => Math.Round(Amount * PurchasePrice, 2);
    public decimal CurrentValue => Math.Round(Amount * CurrentPrice, 2);
    public decimal ProfitLoss => Math.Round(CurrentValue - TotalInvestment, 2);
    public double ProfitLossPercentage => TotalInvestment > 0
        ? Math.Round((double)(ProfitLoss / TotalInvestment * 100), 2)
        : 0.0;

    public string UserId { get; set; } = string.Empty;
}
