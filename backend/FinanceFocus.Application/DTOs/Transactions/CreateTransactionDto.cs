using System;
using FinanceFocus.Domain.Enums;

namespace FinanceFocus.Application.DTOs.Transactions;

public class CreateTransactionDto
{
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime TransactionDate { get; set; }
    public string Category { get; set; } = string.Empty;
    public TransactionType TransactionType { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Account { get; set; } = string.Empty;
}
