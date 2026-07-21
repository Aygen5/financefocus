using System;

namespace FinanceFocus.Domain.Common;

/// <summary>
/// Tüm veritabanı varlıklarının (Entities) kalıtım alacağı taban sınıf.
/// Ortak kimlik (ID) ve zaman damgası alanlarını içerir.
/// </summary>
public abstract class BaseEntity
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
