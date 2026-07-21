using System;
using FinanceFocus.Domain.Common;

namespace FinanceFocus.Domain.Entities;

public class Goal : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public DateTime Deadline { get; set; }
    public string Category { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
}
