using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.AIAssistant;

namespace FinanceFocus.Application.Interfaces;

public interface IAIAssistantService
{
    Task<Result<AIChatResponseDto>> ProcessChatMessageAsync(string userId, AIChatRequestDto request);
    IAsyncEnumerable<string> StreamChatMessageAsync(string userId, AIChatRequestDto request, CancellationToken cancellationToken = default);
}
