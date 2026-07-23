using System;

namespace FinanceFocus.Application.DTOs.Subscriptions;

public class SubscriptionDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string BillingCycle { get; set; } = "Monthly";
    public DateTime NextBillingDate { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public decimal MonthlyEquivalentPrice
    {
        get
        {
            if (!IsActive) return 0m;
            return BillingCycle.ToLower() switch
            {
                "yearly" or "annual" => Math.Round(Price / 12m, 2),
                "weekly" => Math.Round(Price * 4m, 2),
                _ => Math.Round(Price, 2)
            };
        }
    }
    public string UserId { get; set; } = string.Empty;
}
