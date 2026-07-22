using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Repositories;
using FinanceFocus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinanceFocus.Infrastructure.Repositories;

public class PortfolioAssetRepository : Repository<PortfolioAsset>, IPortfolioAssetRepository
{
    public PortfolioAssetRepository(FinanceFocusDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<PortfolioAsset>> GetByUserIdAsync(string userId)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }
}
