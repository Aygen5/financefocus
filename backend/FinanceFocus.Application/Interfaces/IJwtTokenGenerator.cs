using FinanceFocus.Domain.Entities;

namespace FinanceFocus.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(AppUser user);
}
