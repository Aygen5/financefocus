using System;
using FinanceFocus.Domain.Common;

namespace FinanceFocus.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public string Token { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public AppUser? User { get; set; }
    public DateTime ExpiryDate { get; set; }
    public bool IsRevoked { get; set; }
    public bool IsUsed { get; set; }
    public string? ReplacedByToken { get; set; }
    public string? CreatedByIp { get; set; }
    public string? RevokedByIp { get; set; }
    public DateTime? RevokedAt { get; set; }

    public bool IsActive => !IsRevoked && !IsUsed && DateTime.UtcNow < ExpiryDate;
}
