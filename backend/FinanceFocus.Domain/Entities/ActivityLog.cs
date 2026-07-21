using FinanceFocus.Domain.Common;

namespace FinanceFocus.Domain.Entities;

/// <summary>
/// Kullanıcı eylemlerini ve sistem aktivitelerini izleyen varlık sınıfı.
/// </summary>
public class ActivityLog : BaseEntity
{
    public string Action { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "info";
    public string UserId { get; set; } = string.Empty;
}
