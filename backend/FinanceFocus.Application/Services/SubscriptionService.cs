using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Subscriptions;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.UnitOfWork;
using FluentValidation;

namespace FinanceFocus.Application.Services;

public class SubscriptionService : ISubscriptionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateSubscriptionDto> _createValidator;
    private readonly IValidator<UpdateSubscriptionDto> _updateValidator;

    public SubscriptionService(
        IUnitOfWork unitOfWork,
        ICacheService cacheService,
        IMapper mapper,
        IValidator<CreateSubscriptionDto> createValidator,
        IValidator<UpdateSubscriptionDto> updateValidator)
    {
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<Result<IEnumerable<SubscriptionDto>>> GetUserSubscriptionsAsync(string userId)
    {
        var subscriptions = await _unitOfWork.Subscriptions.GetByUserIdAsync(userId);
        var dtos = _mapper.Map<IEnumerable<SubscriptionDto>>(subscriptions);
        return Result<IEnumerable<SubscriptionDto>>.Success(dtos);
    }

    public async Task<Result<SubscriptionDto>> GetSubscriptionByIdAsync(string id, string userId)
    {
        var subscription = await _unitOfWork.Subscriptions.GetByIdAsync(id);
        if (subscription == null || subscription.UserId != userId)
        {
            return Result<SubscriptionDto>.Failure("Abonelik kaydı bulunamadı.");
        }

        var dto = _mapper.Map<SubscriptionDto>(subscription);
        return Result<SubscriptionDto>.Success(dto);
    }

    public async Task<Result<SubscriptionSummaryDto>> GetSubscriptionSummaryAsync(string userId, int upcomingDays = 7)
    {
        var subscriptions = (await _unitOfWork.Subscriptions.GetByUserIdAsync(userId)).ToList();
        var dtos = _mapper.Map<IEnumerable<SubscriptionDto>>(subscriptions).ToList();

        var activeDtos = dtos.Where(s => s.IsActive).ToList();
        var inactiveCount = dtos.Count(s => !s.IsActive);

        var totalMonthlyCost = activeDtos.Sum(s => s.MonthlyEquivalentPrice);

        var today = DateTime.UtcNow.Date;
        var endDate = today.AddDays(upcomingDays);

        var upcomingRenewals = activeDtos
            .Where(s => s.NextBillingDate.Date >= today && s.NextBillingDate.Date <= endDate)
            .OrderBy(s => s.NextBillingDate)
            .ToList();

        var summary = new SubscriptionSummaryDto
        {
            TotalMonthlyCost = totalMonthlyCost,
            ActiveSubscriptionCount = activeDtos.Count,
            InactiveSubscriptionCount = inactiveCount,
            UpcomingRenewalsCount = upcomingRenewals.Count,
            UpcomingRenewals = upcomingRenewals,
            Subscriptions = dtos
        };

        return Result<SubscriptionSummaryDto>.Success(summary);
    }

    public async Task<Result<IEnumerable<SubscriptionDto>>> GetUpcomingRenewalsAsync(string userId, int days = 7)
    {
        var subscriptions = (await _unitOfWork.Subscriptions.GetByUserIdAsync(userId))
            .Where(s => s.IsActive)
            .ToList();

        var today = DateTime.UtcNow.Date;
        var endDate = today.AddDays(days);

        var upcoming = subscriptions
            .Where(s => s.NextBillingDate.Date >= today && s.NextBillingDate.Date <= endDate)
            .OrderBy(s => s.NextBillingDate)
            .ToList();

        var dtos = _mapper.Map<IEnumerable<SubscriptionDto>>(upcoming);
        return Result<IEnumerable<SubscriptionDto>>.Success(dtos);
    }

    public async Task<Result<SubscriptionDto>> CreateSubscriptionAsync(CreateSubscriptionDto dto, string userId)
    {
        var validationResult = await _createValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            return Result<SubscriptionDto>.Failure("Doğrulama hatası oluştu.", errors);
        }

        var existing = await _unitOfWork.Subscriptions.GetByUserIdAsync(userId);
        var isDuplicate = existing.Any(s =>
            s.IsActive &&
            string.Equals(s.Name, dto.Name, StringComparison.OrdinalIgnoreCase));

        if (isDuplicate)
        {
            return Result<SubscriptionDto>.Failure("Bu isimde aktif bir aboneliğiniz zaten bulunmaktadır.");
        }

        var subscription = _mapper.Map<Subscription>(dto);
        subscription.UserId = userId;

        await _unitOfWork.Subscriptions.AddAsync(subscription);
        await _unitOfWork.SaveChangesAsync();

        await _cacheService.RemoveByPrefixAsync(userId);

        var resultDto = _mapper.Map<SubscriptionDto>(subscription);
        return Result<SubscriptionDto>.Success(resultDto, "Abonelik başarıyla oluşturuldu.");
    }

    public async Task<Result<SubscriptionDto>> UpdateSubscriptionAsync(string id, UpdateSubscriptionDto dto, string userId)
    {
        var validationResult = await _updateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            return Result<SubscriptionDto>.Failure("Doğrulama hatası oluştu.", errors);
        }

        var subscription = await _unitOfWork.Subscriptions.GetByIdAsync(id);
        if (subscription == null || subscription.UserId != userId)
        {
            return Result<SubscriptionDto>.Failure("Abonelik kaydı bulunamadı.");
        }

        _mapper.Map(dto, subscription);
        subscription.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Subscriptions.Update(subscription);
        await _unitOfWork.SaveChangesAsync();

        await _cacheService.RemoveByPrefixAsync(userId);

        var resultDto = _mapper.Map<SubscriptionDto>(subscription);
        return Result<SubscriptionDto>.Success(resultDto, "Abonelik başarıyla güncellendi.");
    }

    public async Task<Result> DeleteSubscriptionAsync(string id, string userId)
    {
        var subscription = await _unitOfWork.Subscriptions.GetByIdAsync(id);
        if (subscription == null || subscription.UserId != userId)
        {
            return Result.Failure("Silinecek abonelik kaydı bulunamadı.");
        }

        _unitOfWork.Subscriptions.Delete(subscription);
        await _unitOfWork.SaveChangesAsync();

        await _cacheService.RemoveByPrefixAsync(userId);

        return Result.Success("Abonelik başarıyla silindi.");
    }
}
