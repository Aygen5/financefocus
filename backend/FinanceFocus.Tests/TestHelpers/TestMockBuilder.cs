using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Repositories;
using FinanceFocus.Domain.UnitOfWork;
using Moq;

namespace FinanceFocus.Tests.TestHelpers;

public static class TestMockBuilder
{
    public static Mock<IUnitOfWork> CreateMockUnitOfWork(
        List<Transaction>? transactions = null,
        List<Subscription>? subscriptions = null,
        List<PortfolioAsset>? portfolioAssets = null,
        List<Budget>? budgets = null,
        List<Goal>? goals = null)
    {
        var mockUow = new Mock<IUnitOfWork>();

        var txList = transactions ?? new List<Transaction>();
        var subList = subscriptions ?? new List<Subscription>();
        var portList = portfolioAssets ?? new List<PortfolioAsset>();
        var budgetList = budgets ?? new List<Budget>();
        var goalList = goals ?? new List<Goal>();

        var mockTxRepo = new Mock<ITransactionRepository>();
        mockTxRepo.Setup(r => r.GetByUserIdAsync(It.IsAny<string>()))
            .ReturnsAsync((string uid) => txList.Where(t => t.UserId == uid).ToList());
        mockTxRepo.Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((string id) => txList.FirstOrDefault(t => t.Id == id));

        var mockSubRepo = new Mock<ISubscriptionRepository>();
        mockSubRepo.Setup(r => r.GetByUserIdAsync(It.IsAny<string>()))
            .ReturnsAsync((string uid) => subList.Where(s => s.UserId == uid).ToList());
        mockSubRepo.Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((string id) => subList.FirstOrDefault(s => s.Id == id));

        var mockPortRepo = new Mock<IPortfolioAssetRepository>();
        mockPortRepo.Setup(r => r.GetByUserIdAsync(It.IsAny<string>()))
            .ReturnsAsync((string uid) => portList.Where(p => p.UserId == uid).ToList());
        mockPortRepo.Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((string id) => portList.FirstOrDefault(p => p.Id == id));

        var mockBudgetRepo = new Mock<IBudgetRepository>();
        mockBudgetRepo.Setup(r => r.GetByUserIdAsync(It.IsAny<string>()))
            .ReturnsAsync((string uid) => budgetList.Where(b => b.UserId == uid).ToList());
        mockBudgetRepo.Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((string id) => budgetList.FirstOrDefault(b => b.Id == id));

        var mockGoalRepo = new Mock<IGoalRepository>();
        mockGoalRepo.Setup(r => r.GetByUserIdAsync(It.IsAny<string>()))
            .ReturnsAsync((string uid) => goalList.Where(g => g.UserId == uid).ToList());
        mockGoalRepo.Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((string id) => goalList.FirstOrDefault(g => g.Id == id));

        var mockActRepo = new Mock<IActivityLogRepository>();
        mockActRepo.Setup(r => r.GetByUserIdAsync(It.IsAny<string>()))
            .ReturnsAsync(new List<ActivityLog>());

        var mockNotifRepo = new Mock<INotificationRepository>();
        mockNotifRepo.Setup(r => r.GetByUserIdAsync(It.IsAny<string>()))
            .ReturnsAsync(new List<Notification>());

        mockUow.Setup(u => u.Transactions).Returns(mockTxRepo.Object);
        mockUow.Setup(u => u.Subscriptions).Returns(mockSubRepo.Object);
        mockUow.Setup(u => u.PortfolioAssets).Returns(mockPortRepo.Object);
        mockUow.Setup(u => u.Budgets).Returns(mockBudgetRepo.Object);
        mockUow.Setup(u => u.Goals).Returns(mockGoalRepo.Object);
        mockUow.Setup(u => u.ActivityLogs).Returns(mockActRepo.Object);
        mockUow.Setup(u => u.Notifications).Returns(mockNotifRepo.Object);
        mockUow.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

        return mockUow;
    }

    public static Mock<ICacheService> CreateMockCacheService()
    {
        return new Mock<ICacheService>();
    }
}
