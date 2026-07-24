using System.Threading.Tasks;
using FinanceFocus.Application.Common;

namespace FinanceFocus.Application.Interfaces;

public interface IOnboardingService
{
    Task<Result<bool>> SeedDemoDataAsync(string userId);
}
