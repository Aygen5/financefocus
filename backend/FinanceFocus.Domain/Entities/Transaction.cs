using System;
using FinanceFocus.Domain.Common;
using FinanceFocus.Domain.Enums;

namespace FinanceFocus.Domain.Entities;

/// <summary>
/// Kullanıcının gelir ve gider kayıtlarını temsil eden varlık sınıfı.
/// </summary>
public class Transaction : BaseEntity
{
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime TransactionDate { get; set; }
    public string Category { get; set; } = string.Empty;
    public TransactionType TransactionType { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Account { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
}
