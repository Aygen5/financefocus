using System;

namespace FinanceFocus.Application.Common.Caching;

public static class CacheKeyFactory
{
    public static string Dashboard(string userId) => $"dashboard:{userId}";
    public static string DashboardSummary(string userId) => $"dashboard:summary:{userId}";
    public static string FinancialHealth(string userId) => $"financial-health:{userId}";
    public static string FinancialHealthSummary(string userId) => $"financial-health:summary:{userId}";
    public static string Forecast(string userId) => $"forecast:{userId}";
    public static string ForecastSummary(string userId) => $"forecast:summary:{userId}";
    public static string PortfolioSummary(string userId) => $"portfolio:summary:{userId}";
    public static string AISummary(string userId) => $"ai:summary:{userId}";
    public static string AIAnalysis(string userId) => $"ai:analysis:{userId}";
}

public static class CacheDuration
{
    public static readonly TimeSpan Dashboard = TimeSpan.FromMinutes(2);
    public static readonly TimeSpan FinancialHealth = TimeSpan.FromMinutes(5);
    public static readonly TimeSpan Forecast = TimeSpan.FromMinutes(10);
    public static readonly TimeSpan PortfolioSummary = TimeSpan.FromMinutes(5);
    public static readonly TimeSpan AISummary = TimeSpan.FromMinutes(3);
}
