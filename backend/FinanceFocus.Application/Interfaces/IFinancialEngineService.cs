using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.FinancialEngine;

namespace FinanceFocus.Application.Interfaces;

public interface IFinancialEngineService
{
    Task<Result<FinancialCoreMetricsDto>> CalculateCoreMetricsAsync(string userId);
}
