using System;
using System.Text;
using System.Threading.RateLimiting;
using Asp.Versioning;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Application.Mappings;
using FinanceFocus.Application.Services;
using FinanceFocus.Application.Services.Providers;
using FinanceFocus.Application.Validators.Transactions;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.UnitOfWork;
using FinanceFocus.Infrastructure.Persistence;
using FinanceFocus.Infrastructure.Services;
using FinanceFocus.Infrastructure.UnitOfWork;
using FluentValidation;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace FinanceFocus.API.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(MappingProfile).Assembly);
        services.AddValidatorsFromAssemblyContaining<CreateTransactionValidator>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITransactionService, TransactionService>();
        services.AddScoped<IBudgetService, BudgetService>();
        services.AddScoped<IGoalService, GoalService>();
        services.AddScoped<IPortfolioService, PortfolioService>();
        services.AddScoped<ISubscriptionService, SubscriptionService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IActivityLogService, ActivityLogService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IForecastEngineService, ForecastEngineService>();
        services.AddScoped<IFinancialHealthService, FinancialHealthService>();
        services.AddScoped<IAIProvider, RuleBasedAIProvider>();
        services.AddScoped<IAIAssistantService, AIAssistantService>();
        services.AddScoped<IBackgroundJobService, BackgroundJobService>();

        return services;
    }

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<FinanceFocusDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddIdentity<AppUser, IdentityRole>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequiredLength = 8;
            options.User.RequireUniqueEmail = true;

            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.AllowedForNewUsers = true;
        })
        .AddEntityFrameworkStores<FinanceFocusDbContext>()
        .AddDefaultTokenProviders();

        services.AddMemoryCache();
        services.AddSingleton<ICacheService, MemoryCacheService>();
        services.AddScoped<IJobScheduler, HangfireJobScheduler>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        return services;
    }

    public static IServiceCollection AddHealthChecksConfiguration(this IServiceCollection services)
    {
        services.AddHealthChecks()
            .AddDbContextCheck<FinanceFocusDbContext>(name: "PostgreSQL Database", tags: new[] { "ready" });

        return services;
    }

    public static IServiceCollection AddHangfireConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddHangfire(config => config
            .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings()
            .UsePostgreSqlStorage(options => options.UseNpgsqlConnection(connectionString)));

        services.AddHangfireServer(options =>
        {
            options.WorkerCount = Environment.ProcessorCount * 2;
        });

        return services;
    }

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var secretKey = configuration["JwtSettings:SecretKey"] ?? "FinanceFocusSuperSecretProductionLevelJwtSigningKey2026!";
        var issuer = configuration["JwtSettings:Issuer"] ?? "FinanceFocusAPI";
        var audience = configuration["JwtSettings:Audience"] ?? "FinanceFocusClient";

        var key = Encoding.UTF8.GetBytes(secretKey);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromSeconds(5)
            };
        });

        return services;
    }

    public static IServiceCollection AddRateLimitingConfiguration(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.AddFixedWindowLimiter(policyName: "AuthPolicy", limitOptions =>
            {
                limitOptions.PermitLimit = 5;
                limitOptions.Window = TimeSpan.FromMinutes(1);
                limitOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                limitOptions.QueueLimit = 0;
            });

            options.AddSlidingWindowLimiter(policyName: "ApiPolicy", limitOptions =>
            {
                limitOptions.PermitLimit = 100;
                limitOptions.Window = TimeSpan.FromMinutes(1);
                limitOptions.SegmentsPerWindow = 4;
                limitOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                limitOptions.QueueLimit = 0;
            });
        });

        return services;
    }

    public static IServiceCollection AddApiVersioningConfiguration(this IServiceCollection services)
    {
        services.AddApiVersioning(options =>
        {
            options.DefaultApiVersion = new ApiVersion(1, 0);
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.ReportApiVersions = true;
            options.ApiVersionReader = new UrlSegmentApiVersionReader();
        }).AddApiExplorer(options =>
        {
            options.GroupNameFormat = "'v'VVV";
            options.SubstituteApiVersionInUrl = true;
        });

        return services;
    }

    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.SetIsOriginAllowed(_ => true)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        return services;
    }
}
