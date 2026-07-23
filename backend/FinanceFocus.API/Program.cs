using System;
using FinanceFocus.API.Extensions;
using FinanceFocus.API.Filters;
using FinanceFocus.API.Handlers;
using FinanceFocus.API.Middlewares;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Infrastructure.Persistence;
using Hangfire;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] [{CorrelationId}] {Message:lj}{NewLine}{Exception}")
    .WriteTo.File("logs/financefocus-telemetry-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddHealthChecksConfiguration();
builder.Services.AddHangfireConfiguration(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddRateLimitingConfiguration();
builder.Services.AddApiVersioningConfiguration();
builder.Services.AddCorsConfiguration();

var app = builder.Build();

app.UseMiddleware<CorrelationIdMiddleware>();

app.UseCors("AllowFrontend");

app.UseExceptionHandler();
app.UseMiddleware<SecurityHeadersMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "FinanceFocus API v1");
    });
}
else
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseSerilogRequestLogging();
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new HangfireDashboardAuthorizationFilter() }
});

using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    await DbInitializer.SeedAsync(userManager, roleManager);

    var jobScheduler = scope.ServiceProvider.GetRequiredService<IJobScheduler>();
    jobScheduler.AddOrUpdateRecurring<IBackgroundJobService>(
        "subscription-payment-reminder",
        job => job.ProcessSubscriptionRemindersAsync(),
        "0 8 * * *");

    jobScheduler.AddOrUpdateRecurring<IBackgroundJobService>(
        "goal-progress-reminder",
        job => job.ProcessGoalProgressRemindersAsync(),
        "0 9 * * *");
}

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});

app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false
});

app.MapControllers();

try
{
    Log.Information("Starting FinanceFocus Enterprise Observability Host...");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "FinanceFocus Host terminated unexpectedly.");
}
finally
{
    Log.CloseAndFlush();
}
