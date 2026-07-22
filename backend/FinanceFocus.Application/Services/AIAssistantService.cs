using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.AI;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class AIAssistantService : IAIAssistantService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AIAssistantService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<ChatMessageDto>> ProcessChatAsync(AIChatRequestDto dto, string userId)
    {
        var userMsg = new AIConversation
        {
            UserId = userId,
            MessageText = dto.Message,
            Sender = "user",
            Timestamp = DateTime.UtcNow
        };
        await _unitOfWork.AIConversations.AddAsync(userMsg);

        var mockAiResponseText = $"FinanceFocus AI: '{dto.Message}' talebiniz analiz edildi. Finansal durumunuz stabil görünmektedir.";
        var aiMsg = new AIConversation
        {
            UserId = userId,
            MessageText = mockAiResponseText,
            Sender = "ai",
            Timestamp = DateTime.UtcNow.AddMilliseconds(100)
        };
        await _unitOfWork.AIConversations.AddAsync(aiMsg);
        await _unitOfWork.SaveChangesAsync();

        var chatDto = _mapper.Map<ChatMessageDto>(aiMsg);
        return Result<ChatMessageDto>.Success(chatDto);
    }

    public async Task<Result<IEnumerable<AIConversationDto>>> GetUserConversationsAsync(string userId)
    {
        var conversations = await _unitOfWork.AIConversations.GetByUserIdAsync(userId);
        var dtos = _mapper.Map<IEnumerable<AIConversationDto>>(conversations);
        return Result<IEnumerable<AIConversationDto>>.Success(dtos);
    }
}
