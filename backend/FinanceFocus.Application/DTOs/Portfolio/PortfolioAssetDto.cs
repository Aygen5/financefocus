using FinanceFocus.Domain.Enums;

namespace FinanceFocus.Application.DTOs.Portfolio;

public class PortfolioAssetDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal PurchasePrice { get; set; }
    public AssetType AssetType { get; set; }
    public decimal TotalValue => Amount * PurchasePrice;
    public string UserId { get; set; } = string.Empty;
}
