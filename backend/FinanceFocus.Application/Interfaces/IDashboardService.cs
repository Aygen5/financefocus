using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Dashboard;

namespace FinanceFocus.Application.Interfaces;

public interface IDashboardService
{
    Task<Result<DashboardSummaryDto>> GetDashboardSummaryAsync(string userId);
}
