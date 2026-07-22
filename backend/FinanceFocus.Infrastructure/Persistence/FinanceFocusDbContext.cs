using FinanceFocus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinanceFocus.Infrastructure.Persistence;

public class FinanceFocusDbContext : DbContext
{
    public FinanceFocusDbContext(DbContextOptions<FinanceFocusDbContext> options)
        : base(options)
    {
    }

    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<Goal> Goals => Set<Goal>();
    public DbSet<PortfolioAsset> PortfolioAssets => Set<PortfolioAsset>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();
    public DbSet<AIConversation> AIConversations => Set<AIConversation>();
    public DbSet<ForecastHistory> ForecastHistories => Set<ForecastHistory>();
    public DbSet<FinancialHealthHistory> FinancialHealthHistories => Set<FinancialHealthHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(FinanceFocusDbContext).Assembly);
    }
}
