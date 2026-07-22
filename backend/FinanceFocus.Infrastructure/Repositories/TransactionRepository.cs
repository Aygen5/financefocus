using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Repositories;
using FinanceFocus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinanceFocus.Infrastructure.Repositories;

public class TransactionRepository : Repository<Transaction>, ITransactionRepository
{
    public TransactionRepository(FinanceFocusDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Transaction>> GetByUserIdAsync(string userId)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.TransactionDate)
            .ToListAsync();
    }
}
