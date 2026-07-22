using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Repositories;
using FinanceFocus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinanceFocus.Infrastructure.Repositories;

public class FinancialHealthHistoryRepository : Repository<FinancialHealthHistory>, IFinancialHealthHistoryRepository
{
    public FinancialHealthHistoryRepository(FinanceFocusDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<FinancialHealthHistory>> GetByUserIdAsync(string userId)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.CalculationDate)
            .ToListAsync();
    }

    public async Task<FinancialHealthHistory?> GetLatestScoreByUserIdAsync(string userId)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.CalculationDate)
            .FirstOrDefaultAsync();
    }
}
