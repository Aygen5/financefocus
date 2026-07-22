using System;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.FinancialHealth;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class FinancialHealthService : IFinancialHealthService
{
    private readonly IUnitOfWork _unitOfWork;

    public FinancialHealthService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<FinancialHealthDto>> CalculateHealthScoreAsync(string userId)
    {
        var transactions = (await _unitOfWork.Transactions.GetByUserIdAsync(userId)).ToList();
        var totalIncome = transactions.Where(t => t.TransactionType == TransactionType.Income).Sum(t => t.Amount);
        var totalExpense = transactions.Where(t => t.TransactionType == TransactionType.Expense).Sum(t => t.Amount);

        var savingsRate = totalIncome > 0 ? Math.Max(0m, ((totalIncome - totalExpense) / totalIncome) * 100m) : 0m;
        var debtRatio = totalIncome > 0 ? Math.Min(100m, (totalExpense / totalIncome) * 100m) : 0m;
        var budgetDiscipline = Math.Max(0m, 100m - debtRatio);

        var rawScore = (int)((savingsRate * 0.4m) + ((100m - debtRatio) * 0.4m) + (budgetDiscipline * 0.2m));
        var score = Math.Clamp(rawScore, 0, 100);

        var status = score switch
        {
            >= 85 => "Excellent",
            >= 70 => "Good",
            >= 50 => "Fair",
            >= 30 => "Warning",
            _ => "Critical"
        };

        var dto = new FinancialHealthDto
        {
            Score = score,
            Status = status,
            SavingsRate = Math.Round(savingsRate, 2),
            DebtRatio = Math.Round(debtRatio, 2),
            BudgetDiscipline = Math.Round(budgetDiscipline, 2),
            CalculationDate = DateTime.UtcNow
        };

        var history = new FinancialHealthHistory
        {
            UserId = userId,
            CalculationDate = dto.CalculationDate,
            Score = dto.Score,
            Status = dto.Status,
            SavingsRate = dto.SavingsRate,
            DebtRatio = dto.DebtRatio,
            BudgetDiscipline = dto.BudgetDiscipline
        };

        await _unitOfWork.FinancialHealthHistories.AddAsync(history);
        await _unitOfWork.SaveChangesAsync();

        return Result<FinancialHealthDto>.Success(dto);
    }
}
