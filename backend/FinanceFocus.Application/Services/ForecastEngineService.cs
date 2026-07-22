using System;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Forecast;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class ForecastEngineService : IForecastEngineService
{
    private readonly IUnitOfWork _unitOfWork;

    public ForecastEngineService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ForecastDto>> CalculateForecastAsync(string userId)
    {
        var transactions = (await _unitOfWork.Transactions.GetByUserIdAsync(userId)).ToList();

        var totalIncome = transactions.Where(t => t.TransactionType == TransactionType.Income).Sum(t => t.Amount);
        var totalExpense = transactions.Where(t => t.TransactionType == TransactionType.Expense).Sum(t => t.Amount);

        var avgIncome = transactions.Any() ? totalIncome / Math.Max(1, transactions.Count) * 30 : 0m;
        var avgExpense = transactions.Any() ? totalExpense / Math.Max(1, transactions.Count) * 30 : 0m;

        var forecast = new ForecastDto
        {
            ForecastDate = DateTime.UtcNow.AddMonths(1),
            ProjectedIncome = Math.Round(avgIncome, 2),
            ProjectedExpense = Math.Round(avgExpense, 2),
            ProjectedSavings = Math.Round(avgIncome - avgExpense, 2),
            AlgorithmUsed = "SMA"
        };

        var history = new ForecastHistory
        {
            UserId = userId,
            ForecastDate = forecast.ForecastDate,
            ProjectedIncome = forecast.ProjectedIncome,
            ProjectedExpense = forecast.ProjectedExpense,
            ProjectedSavings = forecast.ProjectedSavings,
            AlgorithmUsed = forecast.AlgorithmUsed
        };

        await _unitOfWork.ForecastHistories.AddAsync(history);
        await _unitOfWork.SaveChangesAsync();

        return Result<ForecastDto>.Success(forecast);
    }
}
