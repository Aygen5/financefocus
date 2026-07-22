using System;

namespace FinanceFocus.Application.DTOs.AI;

public class ChatMessageDto
{
    public string Id { get; set; } = string.Empty;
    public string Sender { get; set; } = "user";
    public string MessageText { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
