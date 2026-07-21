using System;
using FinanceFocus.Domain.Common;

namespace FinanceFocus.Domain.Entities;

public class Subscription : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string BillingCycle { get; set; } = "Monthly";
    public DateTime NextBillingDate { get; set; }
    public string Category { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
}
