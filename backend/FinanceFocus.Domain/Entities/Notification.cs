using FinanceFocus.Domain.Common;
using FinanceFocus.Domain.Enums;

namespace FinanceFocus.Domain.Entities;

/// <summary>
/// Kullanıcı bildirimlerini temsil eden varlık sınıfı.
/// </summary>
public class Notification : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public NotificationType Type { get; set; }
    public bool IsRead { get; set; }
    public string Category { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
}
