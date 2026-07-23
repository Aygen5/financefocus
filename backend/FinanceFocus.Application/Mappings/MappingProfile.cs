using AutoMapper;
using FinanceFocus.Application.DTOs.ActivityLogs;
using FinanceFocus.Application.DTOs.AI;
using FinanceFocus.Application.DTOs.Budgets;
using FinanceFocus.Application.DTOs.FinancialHealth;
using FinanceFocus.Application.DTOs.Forecast;
using FinanceFocus.Application.DTOs.Goals;
using FinanceFocus.Application.DTOs.Notifications;
using FinanceFocus.Application.DTOs.Portfolio;
using FinanceFocus.Application.DTOs.Subscriptions;
using FinanceFocus.Application.DTOs.Transactions;
using FinanceFocus.Domain.Entities;

namespace FinanceFocus.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Transaction, TransactionDto>();
        CreateMap<CreateTransactionDto, Transaction>();
        CreateMap<UpdateTransactionDto, Transaction>();

        CreateMap<Budget, BudgetDto>()
            .ForMember(dest => dest.SpentAmount, opt => opt.Ignore());
        CreateMap<CreateBudgetDto, Budget>();
        CreateMap<UpdateBudgetDto, Budget>();

        CreateMap<Goal, GoalDto>();
        CreateMap<CreateGoalDto, Goal>();
        CreateMap<UpdateGoalDto, Goal>();

        CreateMap<PortfolioAsset, PortfolioAssetDto>();
        CreateMap<CreatePortfolioAssetDto, PortfolioAsset>();
        CreateMap<UpdatePortfolioAssetDto, PortfolioAsset>();

        CreateMap<Subscription, SubscriptionDto>();
        CreateMap<CreateSubscriptionDto, Subscription>();
        CreateMap<UpdateSubscriptionDto, Subscription>();

        CreateMap<Notification, NotificationDto>();
        CreateMap<CreateNotificationDto, Notification>();
        CreateMap<ActivityLog, ActivityLogDto>();
        CreateMap<AIConversation, AIConversationDto>();
        CreateMap<AIConversation, ChatMessageDto>();
        CreateMap<ForecastHistory, ForecastDto>();
        CreateMap<FinancialHealthHistory, FinancialHealthDto>();
    }
}
