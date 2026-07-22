using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Repositories;
using FinanceFocus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinanceFocus.Infrastructure.Repositories;

public class ActivityLogRepository : Repository<ActivityLog>, IActivityLogRepository
{
    public ActivityLogRepository(FinanceFocusDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ActivityLog>> GetByUserIdAsync(string userId)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }
}
