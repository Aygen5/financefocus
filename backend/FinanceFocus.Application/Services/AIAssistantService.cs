using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.Common.Caching;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.Dashboard;
using FinanceFocus.Application.DTOs.FinancialHealth;
using FinanceFocus.Application.DTOs.Forecast;
using FinanceFocus.Application.Interfaces;

namespace FinanceFocus.Application.Services;

public class AIAssistantService : IAIAssistantService
{
    private readonly IDashboardService _dashboardService;
    private readonly IFinancialHealthService _financialHealthService;
    private readonly IForecastEngineService _forecastEngineService;
    private readonly IAIProvider _aiProvider;
    private readonly ICacheService _cacheService;

    public AIAssistantService(
        IDashboardService dashboardService,
        IFinancialHealthService financialHealthService,
        IForecastEngineService forecastEngineService,
        IAIProvider aiProvider,
        ICacheService cacheService)
    {
        _dashboardService = dashboardService;
        _financialHealthService = financialHealthService;
        _forecastEngineService = forecastEngineService;
        _aiProvider = aiProvider;
        _cacheService = cacheService;
    }

    public async Task<Result<AIAssistantDto>> GetFullAnalysisAsync(string userId)
    {
        var cacheKey = CacheKeyFactory.AIAnalysis(userId);
        var cached = await _cacheService.GetAsync<AIAssistantDto>(cacheKey);
        if (cached != null)
        {
            return Result<AIAssistantDto>.Success(cached);
        }

        var (dashboard, health, forecast) = await FetchAllContextDataAsync(userId);

        var summary = await _aiProvider.GenerateSummaryAsync(userId, dashboard, health, forecast);
        var advices = await _aiProvider.GenerateAdvicesAsync(userId, dashboard, health, forecast);
        var riskAnalysis = await _aiProvider.GenerateRiskAnalysisAsync(userId, dashboard, health, forecast);
        var opportunities = await _aiProvider.GenerateOpportunitiesAsync(userId, dashboard, health, forecast);

        var dto = new AIAssistantDto
        {
            Summary = summary,
            Advices = advices,
            RiskAnalysis = riskAnalysis,
            Opportunities = opportunities,
            ProviderUsed = _aiProvider.ProviderName,
            GeneratedAt = DateTime.UtcNow
        };

        await _cacheService.SetAsync(cacheKey, dto, CacheDuration.AISummary);

        return Result<AIAssistantDto>.Success(dto);
    }

    public async Task<Result<IEnumerable<AIAdviceDto>>> GetAdvicesAsync(string userId)
    {
        var (dashboard, health, forecast) = await FetchAllContextDataAsync(userId);
        var advices = await _aiProvider.GenerateAdvicesAsync(userId, dashboard, health, forecast);
        return Result<IEnumerable<AIAdviceDto>>.Success(advices);
    }

    public async Task<Result<AIConversationSummaryDto>> GetSummaryAsync(string userId)
    {
        var cacheKey = CacheKeyFactory.AISummary(userId);
        var cached = await _cacheService.GetAsync<AIConversationSummaryDto>(cacheKey);
        if (cached != null)
        {
            return Result<AIConversationSummaryDto>.Success(cached);
        }

        var (dashboard, health, forecast) = await FetchAllContextDataAsync(userId);
        var summary = await _aiProvider.GenerateSummaryAsync(userId, dashboard, health, forecast);

        await _cacheService.SetAsync(cacheKey, summary, CacheDuration.AISummary);

        return Result<AIConversationSummaryDto>.Success(summary);
    }

    public async Task<Result<IEnumerable<AIAdviceDto>>> GetRiskAnalysisAsync(string userId)
    {
        var (dashboard, health, forecast) = await FetchAllContextDataAsync(userId);
        var riskAnalysis = await _aiProvider.GenerateRiskAnalysisAsync(userId, dashboard, health, forecast);
        return Result<IEnumerable<AIAdviceDto>>.Success(riskAnalysis);
    }

    public async Task<Result<IEnumerable<AIAdviceDto>>> GetOpportunitiesAsync(string userId)
    {
        var (dashboard, health, forecast) = await FetchAllContextDataAsync(userId);
        var opportunities = await _aiProvider.GenerateOpportunitiesAsync(userId, dashboard, health, forecast);
        return Result<IEnumerable<AIAdviceDto>>.Success(opportunities);
    }

    public async Task<Result<AIChatResponseDto>> ProcessChatMessageAsync(string userId, string prompt)
    {
        var (dashboard, health, forecast) = await FetchAllContextDataAsync(userId);
        var response = await _aiProvider.ProcessChatPromptAsync(userId, prompt, dashboard, health, forecast);
        return Result<AIChatResponseDto>.Success(response);
    }

    private async Task<(DashboardDto dashboard, FinancialHealthDto health, ForecastDto forecast)> FetchAllContextDataAsync(string userId)
    {
        var dashboardRes = await _dashboardService.GetFullDashboardAsync(userId);
        var healthRes = await _financialHealthService.CalculateHealthScoreAsync(userId);
        var forecastRes = await _forecastEngineService.CalculateForecastAsync(userId);

        var dashboard = dashboardRes.Data ?? new DashboardDto();
        var health = healthRes.Data ?? new FinancialHealthDto();
        var forecast = forecastRes.Data ?? new ForecastDto();

        return (dashboard, health, forecast);
    }
}
