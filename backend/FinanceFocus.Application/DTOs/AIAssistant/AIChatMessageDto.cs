namespace FinanceFocus.Application.DTOs.AIAssistant;

public class AIChatMessageDto
{
    public string Role { get; set; } = "user";
    public string Content { get; set; } = string.Empty;
}
