namespace FinanceFocus.Application.DTOs.AIAssistant;

public class AIAdviceDto
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
    public string Type { get; set; } = "Info";
}
