using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;

namespace FinanceFocus.Domain.Repositories;

public interface IFinancialHealthHistoryRepository : IRepository<FinancialHealthHistory>
{
    Task<IEnumerable<FinancialHealthHistory>> GetByUserIdAsync(string userId);
    Task<FinancialHealthHistory?> GetLatestScoreByUserIdAsync(string userId);
}
