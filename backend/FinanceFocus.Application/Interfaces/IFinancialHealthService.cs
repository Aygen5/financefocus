using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.FinancialHealth;

namespace FinanceFocus.Application.Interfaces;

public interface IFinancialHealthService
{
    Task<Result<FinancialHealthDto>> CalculateHealthScoreAsync(string userId);
}
