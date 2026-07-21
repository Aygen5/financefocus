using System;
using System.Threading.Tasks;
using FinanceFocus.Domain.Repositories;

namespace FinanceFocus.Domain.UnitOfWork;

public interface IUnitOfWork : IDisposable
{
    ITransactionRepository Transactions { get; }
    IBudgetRepository Budgets { get; }
    IGoalRepository Goals { get; }
    IPortfolioAssetRepository PortfolioAssets { get; }
    ISubscriptionRepository Subscriptions { get; }
    INotificationRepository Notifications { get; }
    IActivityLogRepository ActivityLogs { get; }
    IAIConversationRepository AIConversations { get; }
    IForecastHistoryRepository ForecastHistories { get; }
    IFinancialHealthHistoryRepository FinancialHealthHistories { get; }
    
    Task<int> SaveChangesAsync();
}
