using System;
using System.Threading.Tasks;
using FinanceFocus.Domain.Repositories;
using FinanceFocus.Domain.UnitOfWork;
using FinanceFocus.Infrastructure.Persistence;
using FinanceFocus.Infrastructure.Repositories;
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

    public UnitOfWork(FinanceFocusDbContext context)
    {
        _context = context;
        Transactions = new TransactionRepository(_context);
        Budgets = new BudgetRepository(_context);
        Goals = new GoalRepository(_context);
        PortfolioAssets = new PortfolioAssetRepository(_context);
        Subscriptions = new SubscriptionRepository(_context);
        Notifications = new NotificationRepository(_context);
        ActivityLogs = new ActivityLogRepository(_context);
        AIConversations = new AIConversationRepository(_context);
        ForecastHistories = new ForecastHistoryRepository(_context);
        FinancialHealthHistories = new FinancialHealthHistoryRepository(_context);
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
