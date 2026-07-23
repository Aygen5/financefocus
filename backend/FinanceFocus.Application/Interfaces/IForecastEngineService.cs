using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Forecast;

namespace FinanceFocus.Application.Interfaces;

public interface IForecastEngineService
{
    Task<Result<ForecastDto>> CalculateForecastAsync(string userId);
    Task<Result<ForecastSummaryDto>> GetForecastSummaryAsync(string userId);
    Task<Result<CashFlowForecastDto>> GetCashFlowForecastAsync(string userId);
    Task<Result<IEnumerable<BudgetForecastDto>>> GetBudgetForecastsAsync(string userId);
    Task<Result<IEnumerable<GoalForecastDto>>> GetGoalForecastsAsync(string userId);
    Task<Result<PortfolioForecastDto>> GetPortfolioForecastAsync(string userId);
    Task<Result<SubscriptionForecastDto>> GetSubscriptionForecastAsync(string userId);
}
