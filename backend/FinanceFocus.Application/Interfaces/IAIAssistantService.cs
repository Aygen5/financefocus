using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.AIAssistant;

namespace FinanceFocus.Application.Interfaces;

public interface IAIAssistantService
{
    Task<Result<AIAssistantDto>> GetFullAnalysisAsync(string userId);
    Task<Result<IEnumerable<AIAdviceDto>>> GetAdvicesAsync(string userId);
    Task<Result<AIConversationSummaryDto>> GetSummaryAsync(string userId);
    Task<Result<IEnumerable<AIAdviceDto>>> GetRiskAnalysisAsync(string userId);
    Task<Result<IEnumerable<AIAdviceDto>>> GetOpportunitiesAsync(string userId);
}
