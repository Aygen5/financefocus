using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FinanceFocus.Application.DTOs.Transactions;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Tests.TestHelpers;
using Xunit;

namespace FinanceFocus.Tests.IntegrationTests;

public class TransactionApiIntegrationTests : IClassFixture<FinanceFocusTestFactory>
{
    private readonly FinanceFocusTestFactory _factory;

    public TransactionApiIntegrationTests(FinanceFocusTestFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetAllTransactions_WithoutToken_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/v1/transactions");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateTransaction_WithoutToken_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();
        var dto = new CreateTransactionDto
        {
            Description = "Test Expense",
            Amount = 500m,
            Category = "Market",
            TransactionType = TransactionType.Expense
        };

        var response = await client.PostAsJsonAsync("/api/v1/transactions", dto);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
