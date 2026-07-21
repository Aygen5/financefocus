using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;

namespace FinanceFocus.Domain.Repositories;

/// <summary>
/// PortfolioAsset varlığına özel veri tabanı sorgularını tanımlayan arayüz.
/// </summary>
public interface IPortfolioAssetRepository : IRepository<PortfolioAsset>
{
    Task<IEnumerable<PortfolioAsset>> GetByUserIdAsync(string userId);
}
