using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Domain.Entities;

namespace FinanceFocus.Domain.Repositories;

public interface IAIConversationRepository : IRepository<AIConversation>
{
    Task<IEnumerable<AIConversation>> GetByUserIdAsync(string userId);
    Task<IEnumerable<AIConversation>> GetRecentConversationsAsync(string userId, int limit);
}
