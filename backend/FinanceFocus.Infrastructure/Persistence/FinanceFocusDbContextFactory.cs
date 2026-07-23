using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FinanceFocus.Infrastructure.Persistence;

public class FinanceFocusDbContextFactory : IDesignTimeDbContextFactory<FinanceFocusDbContext>
{
    public FinanceFocusDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<FinanceFocusDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=financefocus_db;Username=postgres;Password=postgres");

        return new FinanceFocusDbContext(optionsBuilder.Options);
    }
}
