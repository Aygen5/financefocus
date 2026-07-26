using System.Net;
using System.Threading.Tasks;
using FinanceFocus.Tests.TestHelpers;
using Xunit;

namespace FinanceFocus.Tests.IntegrationTests;

public class BudgetAndGoalIntegrationTests : IClassFixture<FinanceFocusTestFactory>
{
    private readonly FinanceFocusTestFactory _factory;

    public BudgetAndGoalIntegrationTests(FinanceFocusTestFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetBudgets_WithoutToken_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/v1/budgets");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetGoals_WithoutToken_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/v1/goals");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetPortfolio_WithoutToken_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/v1/portfolio");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetFinancialHealth_WithoutToken_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/v1/financial-health");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
