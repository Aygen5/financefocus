using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;

namespace FinanceFocus.Domain.Repositories;

public interface IGoalRepository : IRepository<Goal>
{
    Task<IEnumerable<Goal>> GetByUserIdAsync(string userId);
}
