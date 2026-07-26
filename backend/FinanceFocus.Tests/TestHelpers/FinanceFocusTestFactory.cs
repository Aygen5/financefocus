using System;
using System.Linq;
using FinanceFocus.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FinanceFocus.Tests.TestHelpers;

public class FinanceFocusTestFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = $"TestDb_{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            var descriptors = services.Where(
                d => d.ServiceType == typeof(DbContextOptions<FinanceFocusDbContext>) ||
                     d.ServiceType == typeof(DbContextOptions)).ToList();

            foreach (var descriptor in descriptors)
            {
                services.Remove(descriptor);
            }

            var inMemoryOptions = new DbContextOptionsBuilder<FinanceFocusDbContext>()
                .UseInMemoryDatabase(_dbName)
                .Options;

            services.AddScoped(_ => new FinanceFocusDbContext(inMemoryOptions));

            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var scopedServices = scope.ServiceProvider;
            var db = scopedServices.GetRequiredService<FinanceFocusDbContext>();
            db.Database.EnsureCreated();
        });
    }
}
