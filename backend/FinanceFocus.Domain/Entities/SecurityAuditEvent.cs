using System;
using FinanceFocus.Domain.Common;

namespace FinanceFocus.Domain.Entities;

public class SecurityAuditEvent : BaseEntity
{
    public string EventType { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsSuccess { get; set; }
    public DateTime EventTime { get; set; } = DateTime.UtcNow;
}
