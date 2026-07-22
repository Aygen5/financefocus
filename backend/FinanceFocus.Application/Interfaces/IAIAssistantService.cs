using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.AI;

namespace FinanceFocus.Application.Interfaces;

public interface IAIAssistantService
{
    Task<Result<ChatMessageDto>> ProcessChatAsync(AIChatRequestDto dto, string userId);
    Task<Result<IEnumerable<AIConversationDto>>> GetUserConversationsAsync(string userId);
}
