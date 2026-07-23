using System.Threading.Tasks;

namespace FinanceFocus.Application.Interfaces;

public interface IBackgroundJobService
{
    Task ProcessSubscriptionRemindersAsync();
    Task ProcessGoalProgressRemindersAsync();
}
