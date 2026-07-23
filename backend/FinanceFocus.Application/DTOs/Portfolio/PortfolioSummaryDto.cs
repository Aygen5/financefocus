using System.Collections.Generic;

namespace FinanceFocus.Application.DTOs.Portfolio;

public class PortfolioSummaryDto
{
    public decimal TotalInvestment { get; set; }
    public decimal TotalCurrentValue { get; set; }
    public decimal TotalProfitLoss { get; set; }
    public double TotalProfitLossPercentage { get; set; }
    public int AssetCount { get; set; }
    public IEnumerable<PortfolioAssetDto> Assets { get; set; } = new List<PortfolioAssetDto>();
}
