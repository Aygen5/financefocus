using System;
using System.Threading.Tasks;
using FinanceFocus.Domain.Repositories;
using FinanceFocus.Domain.UnitOfWork;
using FinanceFocus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Storage;

namespace FinanceFocus.Infrastructure.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly FinanceFocusDbContext _context;
    private IDbContextTransaction? _currentTransaction;
    private bool _disposed;

    public ITransactionRepository Transactions { get; }
    public IBudgetRepository Budgets { get; }
    public IGoalRepository Goals { get; }
    public IPortfolioAssetRepository PortfolioAssets { get; }
    public ISubscriptionRepository Subscriptions { get; }
    public INotificationRepository Notifications { get; }
    public IActivityLogRepository ActivityLogs { get; }
    public IAIConversationRepository AIConversations { get; }
    public IForecastHistoryRepository ForecastHistories { get; }
    public IFinancialHealthHistoryRepository FinancialHealthHistories { get; }

    public UnitOfWork(
        FinanceFocusDbContext context,
        ITransactionRepository transactions,
        IBudgetRepository budgets,
        IGoalRepository goals,
        IPortfolioAssetRepository portfolioAssets,
        ISubscriptionRepository subscriptions,
        INotificationRepository notifications,
        IActivityLogRepository activityLogs,
        IAIConversationRepository aiConversations,
        IForecastHistoryRepository forecastHistories,
        IFinancialHealthHistoryRepository financialHealthHistories)
    {
        _context = context;
        Transactions = transactions;
        Budgets = budgets;
        Goals = goals;
        PortfolioAssets = portfolioAssets;
        Subscriptions = subscriptions;
        Notifications = notifications;
        ActivityLogs = activityLogs;
        AIConversations = aiConversations;
        ForecastHistories = forecastHistories;
        FinancialHealthHistories = financialHealthHistories;
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        if (_currentTransaction != null)
        {
            return;
        }

        _currentTransaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        try
        {
            await SaveChangesAsync();

            if (_currentTransaction != null)
            {
                await _currentTransaction.CommitAsync();
            }
        }
        catch
        {
            await RollbackTransactionAsync();
            throw;
        }
        finally
        {
            if (_currentTransaction != null)
            {
                _currentTransaction.Dispose();
                _currentTransaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync()
    {
        try
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.RollbackAsync();
            }
        }
        finally
        {
            if (_currentTransaction != null)
            {
                _currentTransaction.Dispose();
                _currentTransaction = null;
            }
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _currentTransaction?.Dispose();
                _context.Dispose();
            }

            _disposed = true;
        }
    }
}
