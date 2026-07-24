using System;
using System.Linq;
using System.Threading.Tasks;
using FinanceFocus.Application.Common;
using FinanceFocus.Application.Interfaces;
using FinanceFocus.Domain.Entities;
using FinanceFocus.Domain.Enums;
using FinanceFocus.Domain.UnitOfWork;

namespace FinanceFocus.Application.Services;

public class OnboardingService : IOnboardingService
{
    private readonly IUnitOfWork _unitOfWork;

    public OnboardingService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> SeedDemoDataAsync(string userId)
    {
        var existingTrans = await _unitOfWork.Transactions.GetByUserIdAsync(userId);
        if (existingTrans.Any())
        {
            return Result<bool>.Failure("Demo verileri zaten yüklenmiş.");
        }

        var now = DateTime.UtcNow;

        var sampleTransactions = new[]
        {
            new Transaction
            {
                UserId = userId,
                Description = "Aylık Maaş Ödemesi",
                Amount = 85000,
                TransactionType = TransactionType.Income,
                Category = "Maaş",
                PaymentMethod = "Banka Transferi",
                Account = "Garanti BBVA",
                TransactionDate = now.AddDays(-60)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Freelance Danışmanlık Geliri",
                Amount = 22000,
                TransactionType = TransactionType.Income,
                Category = "Freelance",
                PaymentMethod = "Banka Transferi",
                Account = "İş Bankası",
                TransactionDate = now.AddDays(-45)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Yatırım Temettü Ödemesi",
                Amount = 4500,
                TransactionType = TransactionType.Income,
                Category = "Yatırım Geliri",
                PaymentMethod = "Hesaba Havale",
                Account = "Midas",
                TransactionDate = now.AddDays(-15)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Aylık Maaş Ödemesi",
                Amount = 85000,
                TransactionType = TransactionType.Income,
                Category = "Maaş",
                PaymentMethod = "Banka Transferi",
                Account = "Garanti BBVA",
                TransactionDate = now.AddDays(-30)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Ev Kirası Ödemesi",
                Amount = 28000,
                TransactionType = TransactionType.Expense,
                Category = "Kira & Barınma",
                PaymentMethod = "Banka Transferi",
                Account = "Garanti BBVA",
                TransactionDate = now.AddDays(-58)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Süpermarket Alışverişi",
                Amount = 6400,
                TransactionType = TransactionType.Expense,
                Category = "Market & Gıda",
                PaymentMethod = "Kredi Kartı",
                Account = "Bonus Card",
                TransactionDate = now.AddDays(-50)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Elektrik ve Doğalgaz Faturası",
                Amount = 2150,
                TransactionType = TransactionType.Expense,
                Category = "Faturalar",
                PaymentMethod = "Otomatik Ödeme",
                Account = "Garanti BBVA",
                TransactionDate = now.AddDays(-40)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Restoran ve Dışarıda Yemek",
                Amount = 3200,
                TransactionType = TransactionType.Expense,
                Category = "Restoran & Eğlence",
                PaymentMethod = "Kredi Kartı",
                Account = "Bonus Card",
                TransactionDate = now.AddDays(-35)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Benzin Yakıt Alımı",
                Amount = 2800,
                TransactionType = TransactionType.Expense,
                Category = "Ulaşım & Yakıt",
                PaymentMethod = "Kredi Kartı",
                Account = "Maximum Card",
                TransactionDate = now.AddDays(-28)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Ev Kirası Ödemesi",
                Amount = 28000,
                TransactionType = TransactionType.Expense,
                Category = "Kira & Barınma",
                PaymentMethod = "Banka Transferi",
                Account = "Garanti BBVA",
                TransactionDate = now.AddDays(-28)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Haftalık Market Alışverişi",
                Amount = 5200,
                TransactionType = TransactionType.Expense,
                Category = "Market & Gıda",
                PaymentMethod = "Kredi Kartı",
                Account = "Bonus Card",
                TransactionDate = now.AddDays(-20)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Teknoloji Mağazası (Kulaklık)",
                Amount = 4500,
                TransactionType = TransactionType.Expense,
                Category = "Teknoloji & Elektronik",
                PaymentMethod = "Kredi Kartı",
                Account = "Bonus Card",
                TransactionDate = now.AddDays(-12)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Spor Salonu Yıllık Üyelik",
                Amount = 1200,
                TransactionType = TransactionType.Expense,
                Category = "Sağlık & Spor",
                PaymentMethod = "Kredi Kartı",
                Account = "Maximum Card",
                TransactionDate = now.AddDays(-8)
            },
            new Transaction
            {
                UserId = userId,
                Description = "Kahve ve Kafe Harcaması",
                Amount = 950,
                TransactionType = TransactionType.Expense,
                Category = "Restoran & Eğlence",
                PaymentMethod = "Kredi Kartı",
                Account = "Bonus Card",
                TransactionDate = now.AddDays(-3)
            }
        };

        foreach (var t in sampleTransactions)
        {
            await _unitOfWork.Transactions.AddAsync(t);
        }

        var sampleBudgets = new[]
        {
            new Budget { UserId = userId, Category = "Market & Gıda", Limit = 15000, Month = new DateTime(now.Year, now.Month, 1) },
            new Budget { UserId = userId, Category = "Restoran & Eğlence", Limit = 8000, Month = new DateTime(now.Year, now.Month, 1) },
            new Budget { UserId = userId, Category = "Ulaşım & Yakıt", Limit = 5000, Month = new DateTime(now.Year, now.Month, 1) },
            new Budget { UserId = userId, Category = "Faturalar", Limit = 4000, Month = new DateTime(now.Year, now.Month, 1) }
        };

        foreach (var b in sampleBudgets)
        {
            await _unitOfWork.Budgets.AddAsync(b);
        }

        var sampleGoals = new[]
        {
            new Goal { UserId = userId, Name = "Acil Durum Fonu", TargetAmount = 100000, CurrentAmount = 65000, Category = "Tasarruf", Deadline = now.AddMonths(6) },
            new Goal { UserId = userId, Name = "Yeni MacBook Pro", TargetAmount = 90000, CurrentAmount = 45000, Category = "Teknoloji", Deadline = now.AddMonths(4) },
            new Goal { UserId = userId, Name = "Yaz Tatili Bütçesi", TargetAmount = 50000, CurrentAmount = 32000, Category = "Seyahat", Deadline = now.AddMonths(3) },
            new Goal { UserId = userId, Name = "Yatırım Portföyü", TargetAmount = 250000, CurrentAmount = 140000, Category = "Yatırım", Deadline = now.AddMonths(12) }
        };

        foreach (var g in sampleGoals)
        {
            await _unitOfWork.Goals.AddAsync(g);
        }

        var sampleSubscriptions = new[]
        {
            new Subscription { UserId = userId, Name = "Netflix Premium", Price = 299, BillingCycle = "Monthly", Category = "Eğlence", IsActive = true, NextBillingDate = now.AddDays(5) },
            new Subscription { UserId = userId, Name = "Spotify Family", Price = 99, BillingCycle = "Monthly", Category = "Müzik", IsActive = true, NextBillingDate = now.AddDays(12) },
            new Subscription { UserId = userId, Name = "Claude AI Pro", Price = 750, BillingCycle = "Monthly", Category = "Yazılım", IsActive = true, NextBillingDate = now.AddDays(18) },
            new Subscription { UserId = userId, Name = "MacFit Spor Salonu", Price = 1200, BillingCycle = "Monthly", Category = "Sağlık", IsActive = true, NextBillingDate = now.AddDays(22) }
        };

        foreach (var s in sampleSubscriptions)
        {
            await _unitOfWork.Subscriptions.AddAsync(s);
        }

        var sampleAssets = new[]
        {
            new PortfolioAsset { UserId = userId, Name = "Apple Inc.", Symbol = "AAPL", Amount = 15, PurchasePrice = 175, CurrentPrice = 225, AssetType = AssetType.Stock },
            new PortfolioAsset { UserId = userId, Name = "Bitcoin", Symbol = "BTC", Amount = 0.45m, PurchasePrice = 58000, CurrentPrice = 67000, AssetType = AssetType.Crypto },
            new PortfolioAsset { UserId = userId, Name = "Ethereum", Symbol = "ETH", Amount = 3.5m, PurchasePrice = 2800, CurrentPrice = 3400, AssetType = AssetType.Crypto },
            new PortfolioAsset { UserId = userId, Name = "Gram Altın", Symbol = "ALTIN", Amount = 85, PurchasePrice = 2400, CurrentPrice = 2950, AssetType = AssetType.Gold }
        };

        foreach (var a in sampleAssets)
        {
            await _unitOfWork.PortfolioAssets.AddAsync(a);
        }

        var sampleLogs = new[]
        {
            new ActivityLog { UserId = userId, Action = "Demo Yükleme", ActivityType = "System", Title = "Demo Verileri Yüklendi", Description = "Kullanıcı ilk onboarding sürecinde demo verilerini yükledi.", Category = "Onboarding", Status = "success" },
            new ActivityLog { UserId = userId, Action = "Bütçe Oluşturma", ActivityType = "Budget", Title = "Yeni Bütçeler Tanımlandı", Description = "Aylık mutfak ve eğlence bütçeleri oluşturuldu.", Category = "Budget", Status = "info" }
        };

        foreach (var l in sampleLogs)
        {
            await _unitOfWork.ActivityLogs.AddAsync(l);
        }

        var sampleNotifications = new[]
        {
            new Notification { UserId = userId, Title = "Hoş Geldiniz!", Message = "FinanceFocus hesabınız başarıyla oluşturuldu. Demo verilerini inceleyebilirsiniz.", Type = NotificationType.Info, IsRead = false, Category = "System" },
            new Notification { UserId = userId, Title = "Abonelik Hatırlatması", Message = "Netflix Premium abonelik ödemenize 5 gün kaldı.", Type = NotificationType.Warning, IsRead = false, Category = "Subscription" }
        };

        foreach (var n in sampleNotifications)
        {
            await _unitOfWork.Notifications.AddAsync(n);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<bool>.Success(true, "Demo verileri başarıyla oluşturuldu.");
    }
}
