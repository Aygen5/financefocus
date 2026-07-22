using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Repositories;
using FinanceFocus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinanceFocus.Infrastructure.Repositories;

public class GoalRepository : Repository<Goal>, IGoalRepository
{
    public GoalRepository(FinanceFocusDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Goal>> GetByUserIdAsync(string userId)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(g => g.UserId == userId)
            .OrderBy(g => g.Deadline)
            .ToListAsync();
    }
}
