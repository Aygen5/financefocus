using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Transactions;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class TransactionService : ITransactionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;
    private readonly IMapper _mapper;

    public TransactionService(IUnitOfWork unitOfWork, ICacheService cacheService, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<TransactionDto>>> GetUserTransactionsAsync(string userId)
    {
        var transactions = await _unitOfWork.Transactions.GetByUserIdAsync(userId);
        var dtos = _mapper.Map<IEnumerable<TransactionDto>>(transactions);
        return Result<IEnumerable<TransactionDto>>.Success(dtos);
    }

    public async Task<Result<TransactionDto>> GetTransactionByIdAsync(string id, string userId)
    {
        var transaction = await _unitOfWork.Transactions.GetByIdAsync(id);
        if (transaction == null || transaction.UserId != userId)
        {
            return Result<TransactionDto>.Failure("İşlem bulunamadı.");
        }

        var dto = _mapper.Map<TransactionDto>(transaction);
        return Result<TransactionDto>.Success(dto);
    }

    public async Task<Result<TransactionDto>> CreateTransactionAsync(CreateTransactionDto dto, string userId)
    {
        var transaction = _mapper.Map<Transaction>(dto);
        transaction.UserId = userId;
        transaction.TransactionDate = DateTime.SpecifyKind(dto.TransactionDate, DateTimeKind.Utc);

        await _unitOfWork.Transactions.AddAsync(transaction);

        var isInc = transaction.TransactionType == Domain.Enums.TransactionType.Income;
        var activityLog = new ActivityLog
        {
            UserId = userId,
            Action = isInc ? "Gelir Ekleme" : "Gider Ekleme",
            ActivityType = "Transaction",
            Title = $"{transaction.Category} {(isInc ? "Geliri" : "Gideri")} Eklendi",
            Description = $"{transaction.Amount:N2} ₺ tutarındaki {transaction.Description} işlemi kaydedildi.",
            Category = string.IsNullOrWhiteSpace(transaction.Category) ? "Transaction" : transaction.Category,
            Status = isInc ? "success" : "info",
            CreatedAt = DateTime.UtcNow
        };
        await _unitOfWork.ActivityLogs.AddAsync(activityLog);

        await _unitOfWork.SaveChangesAsync();

        await _cacheService.RemoveByPrefixAsync(userId);
        await _cacheService.RemoveAsync($"financial:engine:{userId}");

        var resultDto = _mapper.Map<TransactionDto>(transaction);
        return Result<TransactionDto>.Success(resultDto, "İşlem başarıyla eklendi.");
    }

    public async Task<Result<TransactionDto>> UpdateTransactionAsync(string id, UpdateTransactionDto dto, string userId)
    {
        var transaction = await _unitOfWork.Transactions.GetByIdAsync(id);
        if (transaction == null || transaction.UserId != userId)
        {
            return Result<TransactionDto>.Failure("Güncellenecek işlem bulunamadı.");
        }

        _mapper.Map(dto, transaction);
        transaction.TransactionDate = DateTime.SpecifyKind(dto.TransactionDate, DateTimeKind.Utc);
        _unitOfWork.Transactions.Update(transaction);

        var activityLog = new ActivityLog
        {
            UserId = userId,
            Action = "İşlem Güncelleme",
            ActivityType = "Transaction",
            Title = $"{transaction.Category} İşlemi Güncellendi",
            Description = $"{transaction.Description} işlemi detayları güncellendi.",
            Category = string.IsNullOrWhiteSpace(transaction.Category) ? "Transaction" : transaction.Category,
            Status = "info",
            CreatedAt = DateTime.UtcNow
        };
        await _unitOfWork.ActivityLogs.AddAsync(activityLog);

        await _unitOfWork.SaveChangesAsync();

        await _cacheService.RemoveByPrefixAsync(userId);
        await _cacheService.RemoveAsync($"financial:engine:{userId}");

        var resultDto = _mapper.Map<TransactionDto>(transaction);
        return Result<TransactionDto>.Success(resultDto, "İşlem başarıyla güncellendi.");
    }

    public async Task<Result> DeleteTransactionAsync(string id, string userId)
    {
        var transaction = await _unitOfWork.Transactions.GetByIdAsync(id);
        if (transaction == null || transaction.UserId != userId)
        {
            return Result.Failure("Silinecek işlem bulunamadı.");
        }

        _unitOfWork.Transactions.Delete(transaction);

        var activityLog = new ActivityLog
        {
            UserId = userId,
            Action = "İşlem Silme",
            ActivityType = "Transaction",
            Title = $"{transaction.Category} İşlemi Silindi",
            Description = $"{transaction.Description} işlemi sistemden kaldırıldı.",
            Category = string.IsNullOrWhiteSpace(transaction.Category) ? "Transaction" : transaction.Category,
            Status = "warning",
            CreatedAt = DateTime.UtcNow
        };
        await _unitOfWork.ActivityLogs.AddAsync(activityLog);

        await _unitOfWork.SaveChangesAsync();

        await _cacheService.RemoveByPrefixAsync(userId);
        await _cacheService.RemoveAsync($"financial:engine:{userId}");

        return Result.Success("İşlem başarıyla silindi.");
    }
}
