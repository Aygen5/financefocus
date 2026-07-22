using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Repositories;
using FinanceFocus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinanceFocus.Infrastructure.Repositories;

public class ForecastHistoryRepository : Repository<ForecastHistory>, IForecastHistoryRepository
{
    public ForecastHistoryRepository(FinanceFocusDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ForecastHistory>> GetByUserIdAsync(string userId)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.ForecastDate)
            .ToListAsync();
    }
}
