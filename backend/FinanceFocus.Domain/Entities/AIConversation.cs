using System;
using FinanceFocus.Domain.Common;

namespace FinanceFocus.Domain.Entities;

public class AIConversation : BaseEntity
{
    public string MessageText { get; set; } = string.Empty;
    public string Sender { get; set; } = "user";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; } = string.Empty;
}
