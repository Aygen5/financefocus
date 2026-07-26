using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FinanceFocus.Application.DTOs.Auth;
using FinanceFocus.Tests.TestHelpers;
using Xunit;

namespace FinanceFocus.Tests.IntegrationTests;

public class AuthApiIntegrationTests : IClassFixture<FinanceFocusTestFactory>
{
    private readonly FinanceFocusTestFactory _factory;

    public AuthApiIntegrationTests(FinanceFocusTestFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Register_WithValidData_ReturnsSuccessResponse()
    {
        var client = _factory.CreateClient();
        var registerDto = new RegisterDto
        {
            FirstName = "Integration",
            LastName = "User",
            Email = "integration.auth@financefocus.com",
            Password = "Password123!"
        };

        var response = await client.PostAsJsonAsync("/api/v1/auth/register", registerDto);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsBadRequestOrUnauthorized()
    {
        var client = _factory.CreateClient();
        var loginDto = new LoginDto
        {
            Email = "nonexistent@financefocus.com",
            Password = "WrongPassword123!"
        };

        var response = await client.PostAsJsonAsync("/api/v1/auth/login", loginDto);

        Assert.True(response.StatusCode == HttpStatusCode.BadRequest || response.StatusCode == HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetMe_WithoutAuthentication_ReturnsUnauthorized()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/v1/auth/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
