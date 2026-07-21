using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;

namespace FinanceFocus.Domain.Repositories;

/// <summary>
/// FinancialHealthHistory varlığına özel veri tabanı sorgularını tanımlayan arayüz.
/// </summary>
public interface IFinancialHealthHistoryRepository : IRepository<FinancialHealthHistory>
{
    Task<IEnumerable<FinancialHealthHistory>> GetByUserIdAsync(string userId);
    Task<FinancialHealthHistory?> GetLatestScoreByUserIdAsync(string userId);
}
