using FinanceFocus.Domain.Common;
using FinanceFocus.Domain.Enums;

namespace FinanceFocus.Domain.Entities;

/// <summary>
/// Kullanıcının yatırım varlıklarını temsil eden varlık sınıfı.
/// </summary>
public class PortfolioAsset : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal PurchasePrice { get; set; }
    public AssetType AssetType { get; set; }
    public string UserId { get; set; } = string.Empty;
}
