using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.DTOs.Subscriptions;
using FinanceFocus.Application.Services;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Tests.TestHelpers;
using FluentValidation;
using FluentValidation.Results;
using Moq;
using Xunit;

namespace FinanceFocus.Tests;

public class SubscriptionServiceTests
{
    private const string TargetUserId = "user-sub-test";
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IValidator<CreateSubscriptionDto>> _createValidatorMock;
    private readonly Mock<IValidator<UpdateSubscriptionDto>> _updateValidatorMock;

    public SubscriptionServiceTests()
    {
        _mapperMock = new Mock<IMapper>();
        _createValidatorMock = new Mock<IValidator<CreateSubscriptionDto>>();
        _updateValidatorMock = new Mock<IValidator<UpdateSubscriptionDto>>();

        _createValidatorMock.Setup(v => v.ValidateAsync(It.IsAny<CreateSubscriptionDto>(), default))
            .ReturnsAsync(new ValidationResult());
        _updateValidatorMock.Setup(v => v.ValidateAsync(It.IsAny<UpdateSubscriptionDto>(), default))
            .ReturnsAsync(new ValidationResult());
    }

    [Theory]
    [InlineData("Monthly", 300, true, 300)]
    [InlineData("Yearly", 1200, true, 100)]
    [InlineData("Annual", 2400, true, 200)]
    [InlineData("Weekly", 50, true, 200)]
    [InlineData("Monthly", 500, false, 0)]
    public void MonthlyEquivalentPrice_ShouldCalculateCorrectPrice_BasedOnBillingCycleAndActiveState(
        string billingCycle, decimal price, bool isActive, decimal expectedMonthlyPrice)
    {
        var dto = new SubscriptionDto
        {
            Price = price,
            BillingCycle = billingCycle,
            IsActive = isActive
        };

        Assert.Equal(expectedMonthlyPrice, dto.MonthlyEquivalentPrice);
    }

    [Fact]
    public async Task GetSubscriptionSummaryAsync_ShouldIncludeOnlyActiveRenewals_WithinUpcomingDaysWindow()
    {
        var today = DateTime.UtcNow.Date;

        var subEntities = new List<Subscription>
        {
            new Subscription { Id = "s-1", UserId = TargetUserId, Name = "Netflix", Price = 200m, BillingCycle = "Monthly", NextBillingDate = today, IsActive = true },
            new Subscription { Id = "s-2", UserId = TargetUserId, Name = "Spotify", Price = 60m, BillingCycle = "Monthly", NextBillingDate = today.AddDays(3), IsActive = true },
            new Subscription { Id = "s-3", UserId = TargetUserId, Name = "iCloud", Price = 30m, BillingCycle = "Monthly", NextBillingDate = today.AddDays(7), IsActive = true },
            new Subscription { Id = "s-4", UserId = TargetUserId, Name = "Amazon", Price = 50m, BillingCycle = "Monthly", NextBillingDate = today.AddDays(15), IsActive = true },
            new Subscription { Id = "s-5", UserId = TargetUserId, Name = "PastSub", Price = 100m, BillingCycle = "Monthly", NextBillingDate = today.AddDays(-2), IsActive = true },
            new Subscription { Id = "s-6", UserId = TargetUserId, Name = "InactiveSub", Price = 300m, BillingCycle = "Monthly", NextBillingDate = today.AddDays(1), IsActive = false }
        };

        _mapperMock.Setup(m => m.Map<IEnumerable<SubscriptionDto>>(It.IsAny<IEnumerable<Subscription>>()))
            .Returns((IEnumerable<Subscription> subs) => subs.Select(s => new SubscriptionDto
            {
                Id = s.Id,
                Name = s.Name,
                Price = s.Price,
                BillingCycle = s.BillingCycle,
                NextBillingDate = s.NextBillingDate,
                IsActive = s.IsActive,
                UserId = s.UserId
            }));

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(subscriptions: subEntities);
        var mockCache = TestMockBuilder.CreateMockCacheService();

        var service = new SubscriptionService(mockUow.Object, mockCache.Object, _mapperMock.Object, _createValidatorMock.Object, _updateValidatorMock.Object);

        var result = await service.GetSubscriptionSummaryAsync(TargetUserId, upcomingDays: 7);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);

        var summary = result.Data;
        Assert.Equal(5, summary.ActiveSubscriptionCount);
        Assert.Equal(1, summary.InactiveSubscriptionCount);
        Assert.Equal(440m, summary.TotalMonthlyCost);
        Assert.Equal(3, summary.UpcomingRenewalsCount);
        Assert.Equal(3, summary.UpcomingRenewals.Count());
        Assert.Contains(summary.UpcomingRenewals, s => s.Name == "Netflix");
        Assert.Contains(summary.UpcomingRenewals, s => s.Name == "Spotify");
        Assert.Contains(summary.UpcomingRenewals, s => s.Name == "iCloud");
    }

    [Fact]
    public async Task CreateSubscriptionAsync_ShouldReturnFailure_WhenDuplicateActiveSubscriptionNameIsAdded()
    {
        var existingSub = new Subscription
        {
            Id = "s-1",
            UserId = TargetUserId,
            Name = "Netflix",
            Price = 200m,
            IsActive = true
        };

        var mockUow = TestMockBuilder.CreateMockUnitOfWork(subscriptions: new List<Subscription> { existingSub });
        var mockCache = TestMockBuilder.CreateMockCacheService();

        var service = new SubscriptionService(mockUow.Object, mockCache.Object, _mapperMock.Object, _createValidatorMock.Object, _updateValidatorMock.Object);

        var createDto = new CreateSubscriptionDto
        {
            Name = "NETFLIX",
            Price = 250m,
            BillingCycle = "Monthly"
        };

        var result = await service.CreateSubscriptionAsync(createDto, TargetUserId);

        Assert.False(result.IsSuccess);
        Assert.Contains("aktif bir aboneliğiniz zaten bulunmaktadır", result.Message);
    }
}
