using System;
using FinanceFocus.Domain.Common;

namespace FinanceFocus.Domain.Entities;

public class Budget : BaseEntity
{
    public string Category { get; set; } = string.Empty;
    public decimal Limit { get; set; }
    public DateTime Month { get; set; }
    public string UserId { get; set; } = string.Empty;
}
