using FinanceFocus.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FinanceFocus.Infrastructure.Persistence;

public class FinanceFocusDbContext : IdentityDbContext<AppUser>
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

        modelBuilder.Entity<Transaction>(builder =>
        {
            builder.HasIndex(t => new { t.UserId, t.TransactionDate });
            builder.HasIndex(t => new { t.UserId, t.TransactionType });
            builder.HasIndex(t => new { t.UserId, t.Category });
        });

        modelBuilder.Entity<Budget>(builder =>
        {
            builder.HasIndex(b => new { b.UserId, b.Category, b.Month }).IsUnique();
        });

        modelBuilder.Entity<Goal>(builder =>
        {
            builder.HasIndex(g => new { g.UserId, g.Name }).IsUnique();
        });

        modelBuilder.Entity<PortfolioAsset>(builder =>
        {
            builder.HasIndex(p => new { p.UserId, p.Symbol });
        });

        modelBuilder.Entity<Subscription>(builder =>
        {
            builder.HasIndex(s => new { s.UserId, s.IsActive, s.NextBillingDate });
        });

        modelBuilder.Entity<Notification>(builder =>
        {
            builder.HasIndex(n => new { n.UserId, n.IsRead, n.CreatedAt });
        });

        modelBuilder.Entity<ActivityLog>(builder =>
        {
            builder.HasIndex(a => new { a.UserId, a.CreatedAt });
        });
    }
}
