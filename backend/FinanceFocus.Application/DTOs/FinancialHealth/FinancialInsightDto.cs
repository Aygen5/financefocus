namespace FinanceFocus.Application.DTOs.FinancialHealth;

public class FinancialInsightDto
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "Info";
    public string Category { get; set; } = "General";
}
