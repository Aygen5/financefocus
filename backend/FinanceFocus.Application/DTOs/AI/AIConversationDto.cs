using System;

namespace FinanceFocus.Application.DTOs.AI;

public class AIConversationDto
{
    public string Id { get; set; } = string.Empty;
    public string MessageText { get; set; } = string.Empty;
    public string Sender { get; set; } = "user";
    public DateTime Timestamp { get; set; }
    public string UserId { get; set; } = string.Empty;
}
