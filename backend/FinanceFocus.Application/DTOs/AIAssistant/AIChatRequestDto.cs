using System.Collections.Generic;

namespace FinanceFocus.Application.DTOs.AIAssistant;

public class AIChatRequestDto
{
    public string Prompt { get; set; } = string.Empty;
    public IEnumerable<AIChatMessageDto>? History { get; set; }
}
