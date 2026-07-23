using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.Common.Caching;
using FinanceFocus.Application.DTOs.Portfolio;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.UnitOfWork;
using FluentValidation;

namespace FinanceFocus.Application.Services;

public class PortfolioService : IPortfolioService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;
    private readonly IMapper _mapper;
    private readonly IValidator<CreatePortfolioAssetDto> _createValidator;
    private readonly IValidator<UpdatePortfolioAssetDto> _updateValidator;

    public PortfolioService(
        IUnitOfWork unitOfWork,
        ICacheService cacheService,
        IMapper mapper,
        IValidator<CreatePortfolioAssetDto> createValidator,
        IValidator<UpdatePortfolioAssetDto> updateValidator)
    {
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<Result<IEnumerable<PortfolioAssetDto>>> GetUserAssetsAsync(string userId)
    {
        var assets = await _unitOfWork.PortfolioAssets.GetByUserIdAsync(userId);
        var dtos = _mapper.Map<IEnumerable<PortfolioAssetDto>>(assets);
        return Result<IEnumerable<PortfolioAssetDto>>.Success(dtos);
    }

    public async Task<Result<PortfolioAssetDto>> GetAssetByIdAsync(string id, string userId)
    {
        var asset = await _unitOfWork.PortfolioAssets.GetByIdAsync(id);
        if (asset == null || asset.UserId != userId)
        {
            return Result<PortfolioAssetDto>.Failure("Varlık kaydı bulunamadı.");
        }

        var dto = _mapper.Map<PortfolioAssetDto>(asset);
        return Result<PortfolioAssetDto>.Success(dto);
    }

    public async Task<Result<PortfolioSummaryDto>> GetPortfolioSummaryAsync(string userId)
    {
        var cacheKey = CacheKeyFactory.PortfolioSummary(userId);
        var cached = await _cacheService.GetAsync<PortfolioSummaryDto>(cacheKey);
        if (cached != null)
        {
            return Result<PortfolioSummaryDto>.Success(cached);
        }

        var assets = (await _unitOfWork.PortfolioAssets.GetByUserIdAsync(userId)).ToList();
        var dtos = _mapper.Map<IEnumerable<PortfolioAssetDto>>(assets).ToList();

        var totalInvestment = dtos.Sum(a => a.TotalInvestment);
        var totalCurrentValue = dtos.Sum(a => a.CurrentValue);
        var totalProfitLoss = Math.Round(totalCurrentValue - totalInvestment, 2);
        var totalProfitLossPercentage = totalInvestment > 0
            ? Math.Round((double)(totalProfitLoss / totalInvestment * 100), 2)
            : 0.0;

        var summary = new PortfolioSummaryDto
        {
            TotalInvestment = totalInvestment,
            TotalCurrentValue = totalCurrentValue,
            TotalProfitLoss = totalProfitLoss,
            TotalProfitLossPercentage = totalProfitLossPercentage,
            AssetCount = dtos.Count,
            Assets = dtos
        };

        await _cacheService.SetAsync(cacheKey, summary, CacheDuration.PortfolioSummary);

        return Result<PortfolioSummaryDto>.Success(summary);
    }

    public async Task<Result<PortfolioAssetDto>> CreateAssetAsync(CreatePortfolioAssetDto dto, string userId)
    {
        var validationResult = await _createValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            return Result<PortfolioAssetDto>.Failure("Doğrulama hatası oluştu.", errors);
        }

        var existingAssets = await _unitOfWork.PortfolioAssets.GetByUserIdAsync(userId);
        var existingAsset = existingAssets.FirstOrDefault(a =>
            string.Equals(a.Symbol, dto.Symbol, StringComparison.OrdinalIgnoreCase));

        if (existingAsset != null)
        {
            var oldTotalInvestment = existingAsset.Amount * existingAsset.PurchasePrice;
            var newTradeInvestment = dto.Amount * dto.PurchasePrice;
            var newTotalAmount = existingAsset.Amount + dto.Amount;
            var newWeightedAverageCost = Math.Round((oldTotalInvestment + newTradeInvestment) / newTotalAmount, 2);

            existingAsset.Amount = newTotalAmount;
            existingAsset.PurchasePrice = newWeightedAverageCost;
            existingAsset.CurrentPrice = dto.CurrentPrice;
            existingAsset.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.PortfolioAssets.Update(existingAsset);
            await _unitOfWork.SaveChangesAsync();

            await _cacheService.RemoveByPrefixAsync(userId);

            var updatedDto = _mapper.Map<PortfolioAssetDto>(existingAsset);
            return Result<PortfolioAssetDto>.Success(updatedDto, "Mevcut varlığın miktarı ve ağırlıklı ortalama maliyeti güncellendi.");
        }

        var asset = _mapper.Map<PortfolioAsset>(dto);
        asset.UserId = userId;

        await _unitOfWork.PortfolioAssets.AddAsync(asset);
        await _unitOfWork.SaveChangesAsync();

        await _cacheService.RemoveByPrefixAsync(userId);

        var resultDto = _mapper.Map<PortfolioAssetDto>(asset);
        return Result<PortfolioAssetDto>.Success(resultDto, "Portföye varlık başarıyla eklendi.");
    }

    public async Task<Result<PortfolioAssetDto>> UpdateAssetAsync(string id, UpdatePortfolioAssetDto dto, string userId)
    {
        var validationResult = await _updateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            return Result<PortfolioAssetDto>.Failure("Doğrulama hatası oluştu.", errors);
        }

        var asset = await _unitOfWork.PortfolioAssets.GetByIdAsync(id);
        if (asset == null || asset.UserId != userId)
        {
            return Result<PortfolioAssetDto>.Failure("Varlık kaydı bulunamadı.");
        }

        _mapper.Map(dto, asset);
        asset.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.PortfolioAssets.Update(asset);
        await _unitOfWork.SaveChangesAsync();

        await _cacheService.RemoveByPrefixAsync(userId);

        var resultDto = _mapper.Map<PortfolioAssetDto>(asset);
        return Result<PortfolioAssetDto>.Success(resultDto, "Varlık kaydı başarıyla güncellendi.");
    }

    public async Task<Result> DeleteAssetAsync(string id, string userId)
    {
        var asset = await _unitOfWork.PortfolioAssets.GetByIdAsync(id);
        if (asset == null || asset.UserId != userId)
        {
            return Result.Failure("Silinecek varlık kaydı bulunamadı.");
        }

        _unitOfWork.PortfolioAssets.Delete(asset);
        await _unitOfWork.SaveChangesAsync();

        await _cacheService.RemoveByPrefixAsync(userId);

        return Result.Success("Varlık kaydı başarıyla silindi.");
    }
}
