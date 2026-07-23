using FinanceFocus.Domain.Enums;

namespace FinanceFocus.Application.DTOs.Portfolio;

public class CreatePortfolioAssetDto
{
    public string Name { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal PurchasePrice { get; set; }
    public decimal CurrentPrice { get; set; }
    public AssetType AssetType { get; set; }
}
