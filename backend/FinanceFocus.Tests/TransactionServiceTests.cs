using System;
using System.Threading.Tasks;
using FinanceFocus.Application.DTOs.Transactions;
using FinanceFocus.Application.Services;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Tests.TestHelpers;
using Moq;
using Xunit;

namespace FinanceFocus.Tests;

public class TransactionServiceTests
{
    [Fact]
    public async Task CreateTransactionAsync_ShouldCreateTransactionSuccessfully_AndEnsureUtcDate()
    {
        // Arrange
        var mockUow = TestMockBuilder.CreateMockUnitOfWork();
        var mockCache = TestMockBuilder.CreateMockCacheService();
        var mockMapper = new Mock<AutoMapper.IMapper>();

        var dto = new CreateTransactionDto
        {
            Description = "Aylık Maaş Ödemesi",
            Amount = 150000m,
            Category = "MAAŞ",
            TransactionType = TransactionType.Income,
            PaymentMethod = "Banka Transferi",
            Account = "Garanti Bankası",
            TransactionDate = new DateTime(2026, 7, 29, 10, 0, 0, DateTimeKind.Unspecified)
        };

        var mappedEntity = new Transaction
        {
            Description = dto.Description,
            Amount = dto.Amount,
            Category = dto.Category,
            TransactionType = dto.TransactionType,
            PaymentMethod = dto.PaymentMethod,
            Account = dto.Account,
            TransactionDate = dto.TransactionDate
        };

        mockMapper.Setup(m => m.Map<Transaction>(It.IsAny<CreateTransactionDto>())).Returns(mappedEntity);
        mockMapper.Setup(m => m.Map<TransactionDto>(It.IsAny<Transaction>())).Returns((Transaction t) => new TransactionDto
        {
            Id = t.Id,
            Description = t.Description,
            Amount = t.Amount,
            Category = t.Category,
            TransactionType = t.TransactionType,
            PaymentMethod = t.PaymentMethod,
            Account = t.Account,
            TransactionDate = t.TransactionDate,
            UserId = t.UserId
        });

        var service = new TransactionService(mockUow.Object, mockCache.Object, mockMapper.Object);
        var userId = "user-tx-test-1";

        // Act
        var result = await service.CreateTransactionAsync(dto, userId);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal("Aylık Maaş Ödemesi", result.Data.Description);
        Assert.Equal(150000m, result.Data.Amount);
        Assert.Equal(TransactionType.Income, result.Data.TransactionType);
    }
}
