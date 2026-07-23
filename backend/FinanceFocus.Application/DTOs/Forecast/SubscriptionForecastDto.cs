using System.Collections.Generic;
using FinanceFocus.Application.DTOs.Subscriptions;

namespace FinanceFocus.Application.DTOs.Forecast;

public class SubscriptionForecastDto
{
    public int ActiveSubscriptionCount { get; set; }
    public decimal Next30DaysTotalCost { get; set; }
    public decimal Next90DaysTotalCost { get; set; }
    public IEnumerable<SubscriptionDto> UpcomingRenewalsIn30Days { get; set; } = new List<SubscriptionDto>();
}
