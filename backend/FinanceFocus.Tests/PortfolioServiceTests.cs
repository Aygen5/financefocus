using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.DTOs.Portfolio;
using FinanceFocus.Application.Services;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Tests.TestHelpers;
using FluentValidation;
using FluentValidation.Results;
using Moq;
using Xunit;

namespace FinanceFocus.Tests;

public class PortfolioServiceTests
{
    private const string TargetUserId = "user-portfolio-test";
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IValidator<CreatePortfolioAssetDto>> _createValidatorMock;
    private readonly Mock<IValidator<UpdatePortfolioAssetDto>> _updateValidatorMock;

    public PortfolioServiceTests()
    {
        _mapperMock = new Mock<IMapper>();
        _createValidatorMock = new Mock<IValidator<CreatePortfolioAssetDto>>();
        _updateValidatorMock = new Mock<IValidator<UpdatePortfolioAssetDto>>();

        _createValidatorMock.Setup(v => v.ValidateAsync(It.IsAny<CreatePortfolioAssetDto>(), default))
            .ReturnsAsync(new ValidationResult());
        _updateValidatorMock.Setup(v => v.ValidateAsync(It.IsAny<UpdatePortfolioAssetDto>(), default))
            .ReturnsAsync(new ValidationResult());
    }

    [Fact]
    public async Task GetPortfolioSummaryAsync_ShouldCalculateNetProfitAndPositivePercentage_WhenCurrentValueExceedsInvestment()
    {
        var assets = new List<PortfolioAsset>
        {
            new PortfolioAsset { Id = "p-1", UserId = TargetUserId, Symbol = "AAPL", Amount = 10m, PurchasePrice = 100m, CurrentPrice = 150m }
        };

        _mapperMock.Setup(m => m.Map<IEnumerable<PortfolioAssetDto>>(It.IsAny<IEnumerable<PortfolioAsset>>()))
            .Returns((IEnumerable<PortfolioAsset> list) => list.Select(a => new PortfolioAssetDto
            {
                Id = a.Id,
                Symbol = a.Symbol,
                Amount = a.Amount,
                PurchasePrice = a.PurchasePrice,
                CurrentPrice = a.CurrentPrice
            }));

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(portfolioAssets: assets);
        var mockCache = TestMockBuilder.CreateMockCacheService();

        var service = new PortfolioService(mockUow.Object, mockCache.Object, _mapperMock.Object, _createValidatorMock.Object, _updateValidatorMock.Object);

        var result = await service.GetPortfolioSummaryAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(1000m, result.Data.TotalInvestment);
        Assert.Equal(1500m, result.Data.TotalCurrentValue);
        Assert.Equal(500m, result.Data.TotalProfitLoss);
        Assert.Equal(50.00, result.Data.TotalProfitLossPercentage);
    }

    [Fact]
    public async Task GetPortfolioSummaryAsync_ShouldCalculateNetLossAndNegativePercentage_WhenCurrentValueIsBelowInvestment()
    {
        var assets = new List<PortfolioAsset>
        {
            new PortfolioAsset { Id = "p-1", UserId = TargetUserId, Symbol = "BTC", Amount = 2m, PurchasePrice = 50000m, CurrentPrice = 35000m }
        };

        _mapperMock.Setup(m => m.Map<IEnumerable<PortfolioAssetDto>>(It.IsAny<IEnumerable<PortfolioAsset>>()))
            .Returns((IEnumerable<PortfolioAsset> list) => list.Select(a => new PortfolioAssetDto
            {
                Id = a.Id,
                Symbol = a.Symbol,
                Amount = a.Amount,
                PurchasePrice = a.PurchasePrice,
                CurrentPrice = a.CurrentPrice
            }));

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(portfolioAssets: assets);
        var mockCache = TestMockBuilder.CreateMockCacheService();

        var service = new PortfolioService(mockUow.Object, mockCache.Object, _mapperMock.Object, _createValidatorMock.Object, _updateValidatorMock.Object);

        var result = await service.GetPortfolioSummaryAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(100000m, result.Data.TotalInvestment);
        Assert.Equal(70000m, result.Data.TotalCurrentValue);
        Assert.Equal(-30000m, result.Data.TotalProfitLoss);
        Assert.Equal(-30.00, result.Data.TotalProfitLossPercentage);
    }

    [Fact]
    public async Task GetPortfolioSummaryAsync_ShouldCalculateZeroProfit_WhenCurrentValueEqualsInvestment()
    {
        var assets = new List<PortfolioAsset>
        {
            new PortfolioAsset { Id = "p-1", UserId = TargetUserId, Symbol = "GOLD", Amount = 100m, PurchasePrice = 2000m, CurrentPrice = 2000m }
        };

        _mapperMock.Setup(m => m.Map<IEnumerable<PortfolioAssetDto>>(It.IsAny<IEnumerable<PortfolioAsset>>()))
            .Returns((IEnumerable<PortfolioAsset> list) => list.Select(a => new PortfolioAssetDto
            {
                Id = a.Id,
                Symbol = a.Symbol,
                Amount = a.Amount,
                PurchasePrice = a.PurchasePrice,
                CurrentPrice = a.CurrentPrice
            }));

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(portfolioAssets: assets);
        var mockCache = TestMockBuilder.CreateMockCacheService();

        var service = new PortfolioService(mockUow.Object, mockCache.Object, _mapperMock.Object, _createValidatorMock.Object, _updateValidatorMock.Object);

        var result = await service.GetPortfolioSummaryAsync(TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(200000m, result.Data.TotalInvestment);
        Assert.Equal(200000m, result.Data.TotalCurrentValue);
        Assert.Equal(0m, result.Data.TotalProfitLoss);
        Assert.Equal(0.00, result.Data.TotalProfitLossPercentage);
    }

    [Fact]
    public async Task CreateAssetAsync_ShouldUpdateWeightedAveragePurchasePrice_WhenDuplicateSymbolIsAdded()
    {
        var existingAsset = new PortfolioAsset
        {
            Id = "p-1",
            UserId = TargetUserId,
            Symbol = "THYAO",
            Amount = 100m,
            PurchasePrice = 100m,
            CurrentPrice = 120m
        };

        _mapperMock.Setup(m => m.Map<PortfolioAssetDto>(It.IsAny<PortfolioAsset>()))
            .Returns((PortfolioAsset a) => new PortfolioAssetDto
            {
                Id = a.Id,
                Symbol = a.Symbol,
                Amount = a.Amount,
                PurchasePrice = a.PurchasePrice,
                CurrentPrice = a.CurrentPrice
            });

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(portfolioAssets: new List<PortfolioAsset> { existingAsset });
        var mockCache = TestMockBuilder.CreateMockCacheService();

        var service = new PortfolioService(mockUow.Object, mockCache.Object, _mapperMock.Object, _createValidatorMock.Object, _updateValidatorMock.Object);

        var createDto = new CreatePortfolioAssetDto
        {
            Symbol = "THYAO",
            Amount = 100m,
            PurchasePrice = 200m,
            CurrentPrice = 220m
        };

        var result = await service.CreateAssetAsync(createDto, TargetUserId);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(200m, existingAsset.Amount);
        Assert.Equal(150m, existingAsset.PurchasePrice);
        Assert.Equal(220m, existingAsset.CurrentPrice);
    }
}
