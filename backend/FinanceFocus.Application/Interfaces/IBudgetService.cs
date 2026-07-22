using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Budgets;

namespace FinanceFocus.Application.Interfaces;

public interface IBudgetService
{
    Task<Result<IEnumerable<BudgetDto>>> GetUserBudgetsAsync(string userId);
    Task<Result<BudgetDto>> CreateBudgetAsync(CreateBudgetDto dto, string userId);
    Task<Result<BudgetDto>> UpdateBudgetAsync(string id, UpdateBudgetDto dto, string userId);
    Task<Result> DeleteBudgetAsync(string id, string userId);
}
