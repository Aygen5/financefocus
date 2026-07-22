using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Portfolio;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class PortfolioService : IPortfolioService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public PortfolioService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<PortfolioAssetDto>>> GetUserAssetsAsync(string userId)
    {
        var assets = await _unitOfWork.PortfolioAssets.GetByUserIdAsync(userId);
        var dtos = _mapper.Map<IEnumerable<PortfolioAssetDto>>(assets);
        return Result<IEnumerable<PortfolioAssetDto>>.Success(dtos);
    }

    public async Task<Result<PortfolioAssetDto>> CreateAssetAsync(CreatePortfolioAssetDto dto, string userId)
    {
        var asset = _mapper.Map<PortfolioAsset>(dto);
        asset.UserId = userId;

        await _unitOfWork.PortfolioAssets.AddAsync(asset);
        await _unitOfWork.SaveChangesAsync();

        var resultDto = _mapper.Map<PortfolioAssetDto>(asset);
        return Result<PortfolioAssetDto>.Success(resultDto, "Portföy varlığı başarıyla eklendi.");
    }

    public async Task<Result<PortfolioAssetDto>> UpdateAssetAsync(string id, UpdatePortfolioAssetDto dto, string userId)
    {
        var asset = await _unitOfWork.PortfolioAssets.GetByIdAsync(id);
        if (asset == null || asset.UserId != userId)
        {
            return Result<PortfolioAssetDto>.Failure("Varlık bulunamadı.");
        }

        _mapper.Map(dto, asset);
        _unitOfWork.PortfolioAssets.Update(asset);
        await _unitOfWork.SaveChangesAsync();

        var resultDto = _mapper.Map<PortfolioAssetDto>(asset);
        return Result<PortfolioAssetDto>.Success(resultDto, "Portföy varlığı güncellendi.");
    }

    public async Task<Result> DeleteAssetAsync(string id, string userId)
    {
        var asset = await _unitOfWork.PortfolioAssets.GetByIdAsync(id);
        if (asset == null || asset.UserId != userId)
        {
            return Result.Failure("Silinecek varlık bulunamadı.");
        }

        _unitOfWork.PortfolioAssets.Delete(asset);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success("Varlık başarıyla silindi.");
    }
}
