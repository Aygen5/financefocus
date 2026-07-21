using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;

namespace FinanceFocus.Domain.Repositories;

/// <summary>
/// Subscription varlığına özel veri tabanı sorgularını tanımlayan arayüz.
/// </summary>
public interface ISubscriptionRepository : IRepository<Subscription>
{
    Task<IEnumerable<Subscription>> GetByUserIdAsync(string userId);
}
