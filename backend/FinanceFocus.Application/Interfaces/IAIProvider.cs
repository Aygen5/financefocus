using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.Dashboard;
using FinanceFocus.Application.DTOs.FinancialHealth;
using FinanceFocus.Application.DTOs.Forecast;

namespace FinanceFocus.Application.Interfaces;

public interface IAIProvider
{
    string ProviderName { get; }
    Task<IEnumerable<AIAdviceDto>> GenerateAdvicesAsync(string userId, DashboardDto dashboard, FinancialHealthDto health, ForecastDto forecast);
    Task<AIConversationSummaryDto> GenerateSummaryAsync(string userId, DashboardDto dashboard, FinancialHealthDto health, ForecastDto forecast);
    Task<IEnumerable<AIAdviceDto>> GenerateRiskAnalysisAsync(string userId, DashboardDto dashboard, FinancialHealthDto health, ForecastDto forecast);
    Task<IEnumerable<AIAdviceDto>> GenerateOpportunitiesAsync(string userId, DashboardDto dashboard, FinancialHealthDto health, ForecastDto forecast);
}
