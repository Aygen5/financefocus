using FinanceFocus.Application.AI.Intent;
using Xunit;

namespace FinanceFocus.Tests;

public class AIIntentClassifierTests
{
    private readonly AIIntentClassifier _classifier = new();

    [Theory]
    [InlineData("Bu ayki aboneliğim kaç TL?", AIIntentType.SubscriptionAnalysisQuestion)]
    [InlineData("Bu ayki aboneliklerim ne kadar?", AIIntentType.SubscriptionAnalysisQuestion)]
    [InlineData("Hangi aboneliğe en fazla para ödüyorum?", AIIntentType.SubscriptionQuestion)]
    [InlineData("Abonelik giderlerimi nasıl azaltabilirim?", AIIntentType.SubscriptionAnalysisQuestion)]
    [InlineData("En pahalı aboneliğim hangisi?", AIIntentType.SubscriptionQuestion)]
    public void Classify_SubscriptionQueries_ReturnsSubscriptionIntent(string prompt, AIIntentType expectedIntent)
    {
        var result = _classifier.Classify(prompt);
        Assert.Equal(expectedIntent, result);
    }

    [Theory]
    [InlineData("Bu ay toplam ne kadar harcama yaptım?", AIIntentType.ExpenseQuestion)]
    [InlineData("Bütçemi nasıl iyileştirebilirim?", AIIntentType.BudgetAdviceQuestion)]
    [InlineData("Tasarruf oranım nasıl?", AIIntentType.SavingsRateQuestion)]
    [InlineData("Gelirime göre giderlerim fazla mı?", AIIntentType.ExpenseComparisonQuestion)]
    [InlineData("Portföyümün durumu nasıl?", AIIntentType.PortfolioAnalysisQuestion)]
    [InlineData("Bu ay finansal durumum nasıl?", AIIntentType.RiskQuestion)]
    public void Classify_FinancialQueries_ReturnsCorrectIntent(string prompt, AIIntentType expectedIntent)
    {
        var result = _classifier.Classify(prompt);
        Assert.Equal(expectedIntent, result);
    }

    [Theory]
    [InlineData("Hava bugün nasıl?", AIIntentType.GeneralConversation)]
    [InlineData("En sevdiğin yemek nedir?", AIIntentType.GeneralConversation)]
    [InlineData("Bana fıkra anlat", AIIntentType.GeneralConversation)]
    public void Classify_NonFinancialQueries_ReturnsGeneralConversation(string prompt, AIIntentType expectedIntent)
    {
        var result = _classifier.Classify(prompt);
        Assert.Equal(expectedIntent, result);
    }
}
