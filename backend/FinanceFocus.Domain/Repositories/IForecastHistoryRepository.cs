using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;

namespace FinanceFocus.Domain.Repositories;

public interface IForecastHistoryRepository : IRepository<ForecastHistory>
{
    Task<IEnumerable<ForecastHistory>> GetByUserIdAsync(string userId);
}
