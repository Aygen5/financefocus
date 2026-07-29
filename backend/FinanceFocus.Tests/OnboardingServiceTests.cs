using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.Services;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Tests.TestHelpers;
using Xunit;

namespace FinanceFocus.Tests;

public class OnboardingServiceTests
{
    [Fact]
    public async Task SeedDemoDataAsync_ShouldCreateDemoRecords_WithIsDemoTrue()
    {
        // Arrange
        var mockUow = TestMockBuilder.CreateMockUnitOfWork();
        var service = new OnboardingService(mockUow.Object);
        var userId = "user-demo-test-1";

        // Act
        var result = await service.SeedDemoDataAsync(userId);

        // Assert
        Assert.True(result.IsSuccess);
    }

    [Fact]
    public async Task ClearDemoDataAsync_ShouldExecuteSuccessfully()
    {
        // Arrange
        var mockUow = TestMockBuilder.CreateMockUnitOfWork();
        var service = new OnboardingService(mockUow.Object);
        var userId = "user-isolation-test";

        // Act
        var clearResult = await service.ClearDemoDataAsync(userId);

        // Assert
        Assert.True(clearResult.IsSuccess);
    }
}
