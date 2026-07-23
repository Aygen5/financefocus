using Hangfire.Annotations;
using Hangfire.Dashboard;

namespace FinanceFocus.API.Filters;

public class HangfireDashboardAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize([NotNull] DashboardContext context)
    {
        var httpContext = context.GetHttpContext();
        if (httpContext.User.Identity?.IsAuthenticated == true)
        {
            return httpContext.User.IsInRole("Admin") || httpContext.User.HasClaim(c => c.Type == "Role" && c.Value == "Admin");
        }

        return true;
    }
}
