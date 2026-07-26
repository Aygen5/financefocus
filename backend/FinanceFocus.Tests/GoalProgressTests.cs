using FinanceFocus.Application.DTOs.Goals;
using Xunit;

namespace FinanceFocus.Tests;

public class GoalProgressTests
{
    [Theory]
    [InlineData(50000, 0, 0.0)]
    [InlineData(50000, 25000, 50.0)]
    [InlineData(50000, 50000, 100.0)]
    [InlineData(50000, 60000, 100.0)]
    [InlineData(0, 10000, 0.0)]
    public void ProgressPercentage_ShouldCalculateCorrectPercentageAndCapAt100(decimal targetAmount, decimal currentAmount, double expectedProgress)
    {
        var goalDto = new GoalDto
        {
            TargetAmount = targetAmount,
            CurrentAmount = currentAmount
        };

        Assert.Equal(expectedProgress, goalDto.ProgressPercentage);
    }
}
