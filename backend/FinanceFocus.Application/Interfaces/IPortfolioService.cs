using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Portfolio;

namespace FinanceFocus.Application.Interfaces;

public interface IPortfolioService
{
    Task<Result<IEnumerable<PortfolioAssetDto>>> GetUserAssetsAsync(string userId);
    Task<Result<PortfolioAssetDto>> GetAssetByIdAsync(string id, string userId);
    Task<Result<PortfolioSummaryDto>> GetPortfolioSummaryAsync(string userId);
    Task<Result<PortfolioAssetDto>> CreateAssetAsync(CreatePortfolioAssetDto dto, string userId);
    Task<Result<PortfolioAssetDto>> UpdateAssetAsync(string id, UpdatePortfolioAssetDto dto, string userId);
    Task<Result> DeleteAssetAsync(string id, string userId);
}
