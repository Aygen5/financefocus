using System.Collections.Generic;

namespace FinanceFocus.Application.DTOs.Subscriptions;

public class SubscriptionSummaryDto
{
    public decimal TotalMonthlyCost { get; set; }
    public int ActiveSubscriptionCount { get; set; }
    public int InactiveSubscriptionCount { get; set; }
    public int UpcomingRenewalsCount { get; set; }
    public IEnumerable<SubscriptionDto> UpcomingRenewals { get; set; } = new List<SubscriptionDto>();
    public IEnumerable<SubscriptionDto> Subscriptions { get; set; } = new List<SubscriptionDto>();
}
