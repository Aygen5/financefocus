using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;

namespace FinanceFocus.Domain.Repositories;

public interface IPortfolioAssetRepository : IRepository<PortfolioAsset>
{
    Task<IEnumerable<PortfolioAsset>> GetByUserIdAsync(string userId);
}
