using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Repositories;
using FinanceFocus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinanceFocus.Infrastructure.Repositories;

public class AIConversationRepository : Repository<AIConversation>, IAIConversationRepository
{
    public AIConversationRepository(FinanceFocusDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<AIConversation>> GetByUserIdAsync(string userId)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<AIConversation>> GetRecentConversationsAsync(string userId, int limit)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.Timestamp)
            .Take(limit)
            .OrderBy(c => c.Timestamp)
            .ToListAsync();
    }
}
