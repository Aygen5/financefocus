using System;
using System.Collections.Generic;

namespace FinanceFocus.Application.DTOs.Forecast;

public class ForecastDto
{
    public CashFlowForecastDto CashFlow { get; set; } = new();
    public IEnumerable<BudgetForecastDto> Budgets { get; set; } = new List<BudgetForecastDto>();
    public IEnumerable<GoalForecastDto> Goals { get; set; } = new List<GoalForecastDto>();
    public PortfolioForecastDto Portfolio { get; set; } = new();
    public SubscriptionForecastDto Subscriptions { get; set; } = new();
    public ForecastSummaryDto Summary { get; set; } = new();
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}
