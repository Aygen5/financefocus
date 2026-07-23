using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Goals;

namespace FinanceFocus.Application.Interfaces;

public interface IGoalService
{
    Task<Result<IEnumerable<GoalDto>>> GetUserGoalsAsync(string userId);
    Task<Result<GoalDto>> GetGoalByIdAsync(string id, string userId);
    Task<Result<GoalDto>> CreateGoalAsync(CreateGoalDto dto, string userId);
    Task<Result<GoalDto>> UpdateGoalAsync(string id, UpdateGoalDto dto, string userId);
    Task<Result> DeleteGoalAsync(string id, string userId);
}
