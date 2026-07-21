using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;

namespace FinanceFocus.Domain.Repositories;

/// <summary>
/// Goal varlığına özel veri tabanı sorgularını tanımlayan arayüz.
/// </summary>
public interface IGoalRepository : IRepository<Goal>
{
    Task<IEnumerable<Goal>> GetByUserIdAsync(string userId);
}
