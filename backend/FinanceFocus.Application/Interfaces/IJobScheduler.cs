using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace FinanceFocus.Application.Interfaces;

public interface IJobScheduler
{
    string Enqueue<T>(Expression<Func<T, Task>> methodCall);
    string Schedule<T>(Expression<Func<T, Task>> methodCall, TimeSpan delay);
    void AddOrUpdateRecurring<T>(string recurringJobId, Expression<Func<T, Task>> methodCall, string cronExpression);
    bool RemoveRecurring(string recurringJobId);
}
