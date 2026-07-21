using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;

namespace FinanceFocus.Domain.Repositories;

/// <summary>
/// ActivityLog varlığına özel veri tabanı sorgularını tanımlayan arayüz.
/// </summary>
public interface IActivityLogRepository : IRepository<ActivityLog>
{
    Task<IEnumerable<ActivityLog>> GetByUserIdAsync(string userId);
}
