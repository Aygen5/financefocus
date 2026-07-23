using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.FinancialHealth;

namespace FinanceFocus.Application.Interfaces;

public interface IFinancialHealthService
{
    Task<Result<FinancialHealthDto>> CalculateHealthScoreAsync(string userId);
    Task<Result<FinancialHealthSummaryDto>> GetHealthSummaryAsync(string userId);
    Task<Result<IEnumerable<FinancialInsightDto>>> GetInsightsAsync(string userId);
    Task<Result<ScoreBreakdownDto>> GetScoreBreakdownAsync(string userId);
}
