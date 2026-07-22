using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Transactions;

namespace FinanceFocus.Application.Interfaces;

public interface ITransactionService
{
    Task<Result<IEnumerable<TransactionDto>>> GetUserTransactionsAsync(string userId);
    Task<Result<TransactionDto>> GetTransactionByIdAsync(string id, string userId);
    Task<Result<TransactionDto>> CreateTransactionAsync(CreateTransactionDto dto, string userId);
    Task<Result<TransactionDto>> UpdateTransactionAsync(string id, UpdateTransactionDto dto, string userId);
    Task<Result> DeleteTransactionAsync(string id, string userId);
}
