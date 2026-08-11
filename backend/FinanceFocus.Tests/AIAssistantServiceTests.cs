using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceFocus.Application.AI.Intent;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.DTOs.AIAssistant;
using FinanceFocus.Application.DTOs.FinancialEngine;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Application.Services;
using FinanceFocus.Application.Services.Providers;
using Moq;
using Xunit;

namespace FinanceFocus.Tests;

public class AIAssistantServiceTests
{
    private readonly Mock<IFinancialEngineService> _financialEngineMock = new();
    private readonly AIIntentClassifier _classifier = new();
    private readonly Mock<IAIProvider> _aiProviderMock = new();
    private readonly AIAssistantService _service;

    public AIAssistantServiceTests()
    {
        var testMetrics = new FinancialCoreMetricsDto
        {
            MonthlyIncome = 150000m,
            MonthlyExpense = 10000m,
            NetSavings = 140000m,
            SavingsRate = 93.33m,
            TotalBalance = 500000m,
            FinancialHealthScore = 95,
            RiskLevel = "Excellent",
            IncomeToExpenseRatio = 15m,
            LargestSpendingCategory = "Kira",
            LargestSpendingAmount = 5000m,
            OverBudgetCategoryCount = 0,
            ActiveSubscriptionCount = 2,
            TotalMonthlySubscriptionCost = 600m,
            MostExpensiveSubscriptionName = "Gym Pass",
            MostExpensiveSubscriptionPrice = 400m,
            CategoryExpenses = new List<CategorySpendingDto>
            {
                new CategorySpendingDto { Category = "Kira", Amount = 5000m, Limit = 10000m, Percentage = 50.0 },
                new CategorySpendingDto { Category = "Yemek", Amount = 2100m, Limit = 5000m, Percentage = 42.0 },
                new CategorySpendingDto { Category = "Market", Amount = 1500m, Limit = 4000m, Percentage = 37.5 }
            }
        };

        _financialEngineMock
            .Setup(x => x.CalculateCoreMetricsAsync(It.IsAny<string>()))
            .ReturnsAsync(Result<FinancialCoreMetricsDto>.Success(testMetrics));

        // Simulate local Ollama being offline to test fallback advisor engine
        _aiProviderMock
            .Setup(x => x.ProcessChatPromptAsync(
                It.IsAny<string>(), It.IsAny<string>(), It.IsAny<AIIntentType>(), It.IsAny<IEnumerable<AIChatMessageDto>>(), It.IsAny<FinancialCoreMetricsDto>()))
            .ThrowsAsync(new OllamaUnavailableException("Ollama offline"));

        _service = new AIAssistantService(_financialEngineMock.Object, _classifier, _aiProviderMock.Object);
    }

    [Theory]
    [InlineData("Bu ay nerede fazla harcadım?")]
    [InlineData("Bütçemi nasıl iyileştirebilirim?")]
    [InlineData("Tasarruf önerisi oluştur.")]
    [InlineData("Önümüzdeki ay beni ne bekliyor?")]
    [InlineData("Finansal sağlığımı analiz et.")]
    [InlineData("Bu ay toplam giderim ne kadar?")]
    [InlineData("En çok hangi kategoride harcama yaptım?")]
    [InlineData("Bu ay ne kadar tasarruf ettim?")]
    [InlineData("Aboneliklerime ne kadar para gidiyor?")]
    [InlineData("Giderlerimi nasıl azaltabilirim?")]
    public async Task ProcessChatMessageAsync_AllTenMandatoryQuestions_ReturnDetailedDataDrivenResponses(string userQuestion)
    {
        var request = new AIChatRequestDto { Prompt = userQuestion };
        var result = await _service.ProcessChatMessageAsync("user-123", request);

        Assert.NotNull(result);
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);

        var answer = result.Data.Answer;

        // Verify answer is not empty or just a title or default fallback greeting
        Assert.False(string.IsNullOrWhiteSpace(answer));
        Assert.DoesNotContain("Finansal konular dışındaki sorulara yanıt veremiyorum", answer);

        // Verify real data identifiers are present in the answer
        Assert.True(answer.Contains("10") || answer.Contains("150") || answer.Contains("140") || answer.Contains("Kira") || answer.Contains("5") || answer.Contains("95") || answer.Contains("600"));
    }

    [Fact]
    public async Task ProcessChatMessageAsync_NonFinancialQuestion_ReturnsGeneralConversationMessage()
    {
        var request = new AIChatRequestDto { Prompt = "Bugün hava nasıl?" };
        var result = await _service.ProcessChatMessageAsync("user-123", request);

        Assert.NotNull(result);
        Assert.True(result.IsSuccess);
        Assert.Contains("Finansal konular dışındaki sorulara yanıt veremiyorum", result.Data!.Answer);
    }
}
