using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Forecast;

namespace FinanceFocus.Application.Interfaces;

public interface IForecastEngineService
{
    Task<Result<ForecastDto>> CalculateForecastAsync(string userId);
}
