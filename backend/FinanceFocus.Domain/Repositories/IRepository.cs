using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Domain.Common;

namespace FinanceFocus.Domain.Repositories;

/// <summary>
/// Tüm varlıklar (Entities) için temel CRUD operasyonlarını tanımlayan generic repository arayüzü.
/// </summary>
/// <typeparam name="T">BaseEntity sınıfından kalıtım alan varlık türü.</typeparam>
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(string id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
}
