using System;

namespace FinanceFocus.Application.DTOs.Subscriptions;

public class UpdateSubscriptionDto
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string BillingCycle { get; set; } = "Monthly";
    public DateTime NextBillingDate { get; set; }
    public string Category { get; set; } = string.Empty;
}
