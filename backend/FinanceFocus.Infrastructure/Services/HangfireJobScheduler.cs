using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using FinanceFocus.Application.Interfaces;
using Hangfire;

namespace FinanceFocus.Infrastructure.Services;

public class HangfireJobScheduler : IJobScheduler
{
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly IRecurringJobManager _recurringJobManager;

    public HangfireJobScheduler(IBackgroundJobClient backgroundJobClient, IRecurringJobManager recurringJobManager)
    {
        _backgroundJobClient = backgroundJobClient;
        _recurringJobManager = recurringJobManager;
    }

    public string Enqueue<T>(Expression<Func<T, Task>> methodCall)
    {
        return _backgroundJobClient.Enqueue(methodCall);
    }

    public string Schedule<T>(Expression<Func<T, Task>> methodCall, TimeSpan delay)
    {
        return _backgroundJobClient.Schedule(methodCall, delay);
    }

    public void AddOrUpdateRecurring<T>(string recurringJobId, Expression<Func<T, Task>> methodCall, string cronExpression)
    {
        _recurringJobManager.AddOrUpdate(recurringJobId, methodCall, cronExpression);
    }

    public bool RemoveRecurring(string recurringJobId)
    {
        _recurringJobManager.RemoveIfExists(recurringJobId);
        return true;
    }
}
