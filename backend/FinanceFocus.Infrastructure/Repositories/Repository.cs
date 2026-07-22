using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Domain.Common;
using FinanceFocus.Domain.Repositories;
using FinanceFocus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FinanceFocus.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly FinanceFocusDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(FinanceFocusDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(string id)
    {
        return await _dbSet.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.AsNoTracking().ToListAsync();
    }

    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }
}
