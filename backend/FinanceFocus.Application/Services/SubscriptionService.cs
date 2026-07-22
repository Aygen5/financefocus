using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Subscriptions;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class SubscriptionService : ISubscriptionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SubscriptionService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<SubscriptionDto>>> GetUserSubscriptionsAsync(string userId)
    {
        var subscriptions = await _unitOfWork.Subscriptions.GetByUserIdAsync(userId);
        var dtos = _mapper.Map<IEnumerable<SubscriptionDto>>(subscriptions);
        return Result<IEnumerable<SubscriptionDto>>.Success(dtos);
    }

    public async Task<Result<SubscriptionDto>> CreateSubscriptionAsync(CreateSubscriptionDto dto, string userId)
    {
        var subscription = _mapper.Map<Subscription>(dto);
        subscription.UserId = userId;

        await _unitOfWork.Subscriptions.AddAsync(subscription);
        await _unitOfWork.SaveChangesAsync();

        var resultDto = _mapper.Map<SubscriptionDto>(subscription);
        return Result<SubscriptionDto>.Success(resultDto, "Abonelik başarıyla eklendi.");
    }

    public async Task<Result<SubscriptionDto>> UpdateSubscriptionAsync(string id, UpdateSubscriptionDto dto, string userId)
    {
        var subscription = await _unitOfWork.Subscriptions.GetByIdAsync(id);
        if (subscription == null || subscription.UserId != userId)
        {
            return Result<SubscriptionDto>.Failure("Abonelik bulunamadı.");
        }

        _mapper.Map(dto, subscription);
        _unitOfWork.Subscriptions.Update(subscription);
        await _unitOfWork.SaveChangesAsync();

        var resultDto = _mapper.Map<SubscriptionDto>(subscription);
        return Result<SubscriptionDto>.Success(resultDto, "Abonelik güncellendi.");
    }

    public async Task<Result> DeleteSubscriptionAsync(string id, string userId)
    {
        var subscription = await _unitOfWork.Subscriptions.GetByIdAsync(id);
        if (subscription == null || subscription.UserId != userId)
        {
            return Result.Failure("Silinecek abonelik bulunamadı.");
        }

        _unitOfWork.Subscriptions.Delete(subscription);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success("Abonelik silindi.");
    }
}
