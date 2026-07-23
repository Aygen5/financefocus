namespace FinanceFocus.Application.DTOs.Forecast;

public class PortfolioForecastDto
{
    public decimal CurrentTotalInvestment { get; set; }
    public decimal CurrentTotalValue { get; set; }
    public decimal AverageReturnRatePercentage { get; set; }
    public decimal ExpectedPortfolioValueIn6Months { get; set; }
    public decimal ExpectedPortfolioValueIn12Months { get; set; }
    public decimal ExpectedProfitLossIn12Months { get; set; }
}
