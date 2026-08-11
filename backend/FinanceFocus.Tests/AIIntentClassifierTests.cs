using FinanceFocus.Application.AI.Intent;
using Xunit;

namespace FinanceFocus.Tests;

public class AIIntentClassifierTests
{
    private readonly AIIntentClassifier _classifier = new();

    [Theory]
    [InlineData("Bu ay nerede fazla harcadım?", AIIntentType.SpendingAnalysisQuestion)]
    [InlineData("Bütçemi nasıl iyileştirebilirim?", AIIntentType.BudgetAdviceQuestion)]
    [InlineData("Tasarruf önerisi oluştur.", AIIntentType.SavingsAdviceQuestion)]
    [InlineData("Önümüzdeki ay beni ne bekliyor?", AIIntentType.ForecastQuestion)]
    [InlineData("Finansal sağlığımı analiz et.", AIIntentType.FinancialHealthQuestion)]
    [InlineData("Bu ay toplam giderim ne kadar?", AIIntentType.ExpenseQuestion)]
    [InlineData("En çok hangi kategoride harcama yaptım?", AIIntentType.LargestExpenseQuestion)]
    [InlineData("Bu ay ne kadar tasarruf ettim?", AIIntentType.SavingsQuestion)]
    [InlineData("Aboneliklerime ne kadar para gidiyor?", AIIntentType.SubscriptionAnalysisQuestion)]
    [InlineData("Giderlerimi nasıl azaltabilirim?", AIIntentType.ExpenseReductionQuestion)]
    public void Classify_TenMandatoryUserQuestions_ReturnsCorrectSpecificIntents(string prompt, AIIntentType expectedIntent)
    {
        var result = _classifier.Classify(prompt);
        Assert.Equal(expectedIntent, result);
    }

    [Theory]
    [InlineData("Bu ayki aboneliğim kaç TL?", AIIntentType.SubscriptionAnalysisQuestion)]
    [InlineData("Bu ayki aboneliklerim ne kadar?", AIIntentType.SubscriptionAnalysisQuestion)]
    [InlineData("Hangi aboneliğe en fazla para ödüyorum?", AIIntentType.SubscriptionQuestion)]
    [InlineData("Abonelik giderlerimi nasıl azaltabilirim?", AIIntentType.ExpenseReductionQuestion)]
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
    [InlineData("Bu ay finansal durumum nasıl?", AIIntentType.FinancialHealthQuestion)]
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
