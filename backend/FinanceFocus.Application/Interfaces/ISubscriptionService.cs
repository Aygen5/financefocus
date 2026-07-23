using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.Subscriptions;

namespace FinanceFocus.Application.Interfaces;

public interface ISubscriptionService
{
    Task<Result<IEnumerable<SubscriptionDto>>> GetUserSubscriptionsAsync(string userId);
    Task<Result<SubscriptionDto>> GetSubscriptionByIdAsync(string id, string userId);
    Task<Result<SubscriptionSummaryDto>> GetSubscriptionSummaryAsync(string userId, int upcomingDays = 7);
    Task<Result<IEnumerable<SubscriptionDto>>> GetUpcomingRenewalsAsync(string userId, int days = 7);
    Task<Result<SubscriptionDto>> CreateSubscriptionAsync(CreateSubscriptionDto dto, string userId);
    Task<Result<SubscriptionDto>> UpdateSubscriptionAsync(string id, UpdateSubscriptionDto dto, string userId);
    Task<Result> DeleteSubscriptionAsync(string id, string userId);
}
