using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.DTOs.Dashboard;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.DTOs.Transactions;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DashboardService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<DashboardSummaryDto>> GetDashboardSummaryAsync(string userId)
    {
        var transactions = (await _unitOfWork.Transactions.GetByUserIdAsync(userId)).ToList();
        var budgets = (await _unitOfWork.Budgets.GetByUserIdAsync(userId)).ToList();
        var goals = (await _unitOfWork.Goals.GetByUserIdAsync(userId)).ToList();

        var income = transactions.Where(t => t.TransactionType == TransactionType.Income).Sum(t => t.Amount);
        var expense = transactions.Where(t => t.TransactionType == TransactionType.Expense).Sum(t => t.Amount);

        var summary = new DashboardSummaryDto
        {
            TotalBalance = income - expense,
            MonthlyIncome = income,
            MonthlyExpense = expense,
            NetSavings = income - expense,
            RecentTransactions = _mapper.Map<IEnumerable<TransactionDto>>(transactions.Take(5)),
            ActiveBudgets = _mapper.Map<IEnumerable<BudgetDto>>(budgets.Take(5)),
            TopGoals = _mapper.Map<IEnumerable<GoalDto>>(goals.Take(5))
        };

        return Result<DashboardSummaryDto>.Success(summary);
    }
}
