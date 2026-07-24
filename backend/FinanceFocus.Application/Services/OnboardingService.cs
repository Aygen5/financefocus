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
            foreach (var t in existingTrans)
            {
                _unitOfWork.Transactions.Delete(t);
            }

            var existingBudgets = await _unitOfWork.Budgets.GetByUserIdAsync(userId);
            foreach (var b in existingBudgets)
            {
                _unitOfWork.Budgets.Delete(b);
            }

            var existingGoals = await _unitOfWork.Goals.GetByUserIdAsync(userId);
            foreach (var g in existingGoals)
            {
                _unitOfWork.Goals.Delete(g);
            }

            var existingSubs = await _unitOfWork.Subscriptions.GetByUserIdAsync(userId);
            foreach (var s in existingSubs)
            {
                _unitOfWork.Subscriptions.Delete(s);
            }

            var existingAssets = await _unitOfWork.PortfolioAssets.GetByUserIdAsync(userId);
            foreach (var a in existingAssets)
            {
                _unitOfWork.PortfolioAssets.Delete(a);
            }

            var existingLogs = await _unitOfWork.ActivityLogs.GetByUserIdAsync(userId);
            foreach (var l in existingLogs)
            {
                _unitOfWork.ActivityLogs.Delete(l);
            }

            var existingNotifs = await _unitOfWork.Notifications.GetByUserIdAsync(userId);
            foreach (var n in existingNotifs)
            {
                _unitOfWork.Notifications.Delete(n);
            }

            await _unitOfWork.SaveChangesAsync();
        }

        var sampleTransactions = new[]
        {
            new Transaction { UserId = userId, Description = "Aylık Maaş Ödemesi (Şubat)", Amount = 80000, TransactionType = TransactionType.Income, Category = "Maaş", PaymentMethod = "Banka Transferi", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 2, 1, 9, 0, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Ev Kirası & Harcamalar (Şubat)", Amount = 45000, TransactionType = TransactionType.Expense, Category = "Ev Kirası & Barınma", PaymentMethod = "Banka Transferi", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 2, 5, 10, 0, 0), DateTimeKind.Utc) },

            new Transaction { UserId = userId, Description = "Aylık Maaş Ödemesi (Mart)", Amount = 85000, TransactionType = TransactionType.Income, Category = "Maaş", PaymentMethod = "Banka Transferi", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 3, 1, 9, 0, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Ev Kirası & Harcamalar (Mart)", Amount = 48000, TransactionType = TransactionType.Expense, Category = "Ev Kirası & Barınma", PaymentMethod = "Banka Transferi", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 3, 5, 10, 0, 0), DateTimeKind.Utc) },

            new Transaction { UserId = userId, Description = "Aylık Maaş Ödemesi (Nisan)", Amount = 85000, TransactionType = TransactionType.Income, Category = "Maaş", PaymentMethod = "Banka Transferi", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 4, 1, 9, 0, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Ev Kirası & Harcamalar (Nisan)", Amount = 50000, TransactionType = TransactionType.Expense, Category = "Ev Kirası & Barınma", PaymentMethod = "Banka Transferi", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 4, 5, 10, 0, 0), DateTimeKind.Utc) },

            new Transaction { UserId = userId, Description = "Aylık Maaş Ödemesi (Mayıs)", Amount = 90000, TransactionType = TransactionType.Income, Category = "Maaş", PaymentMethod = "Banka Transferi", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 5, 1, 9, 0, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Ev Kirası & Harcamalar (Mayıs)", Amount = 52000, TransactionType = TransactionType.Expense, Category = "Ev Kirası & Barınma", PaymentMethod = "Banka Transferi", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 5, 5, 10, 0, 0), DateTimeKind.Utc) },

            new Transaction { UserId = userId, Description = "Aylık Maaş Ödemesi (Haziran)", Amount = 90000, TransactionType = TransactionType.Income, Category = "Maaş", PaymentMethod = "Banka Transferi", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 6, 1, 9, 0, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Ev Kirası & Harcamalar (Haziran)", Amount = 55000, TransactionType = TransactionType.Expense, Category = "Ev Kirası & Barınma", PaymentMethod = "Banka Transferi", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 6, 5, 10, 0, 0), DateTimeKind.Utc) },

            new Transaction { UserId = userId, Description = "Aylık Maaş Ödemesi", Amount = 95000, TransactionType = TransactionType.Income, Category = "Maaş", PaymentMethod = "Banka Transferi", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 7, 1, 9, 0, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Freelance Danışmanlık Geliri", Amount = 25000, TransactionType = TransactionType.Income, Category = "Freelance", PaymentMethod = "Banka Transferi", Account = "İş Bankası", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 7, 10, 14, 30, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Ev Kirası Ödemesi", Amount = 28000, TransactionType = TransactionType.Expense, Category = "Ev Kirası & Barınma", PaymentMethod = "Banka Transferi", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 7, 2, 10, 0, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Aylık Süpermarket Alışverişi", Amount = 12500, TransactionType = TransactionType.Expense, Category = "Market & Gıda", PaymentMethod = "Kredi Kartı", Account = "Bonus Card", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 7, 5, 17, 45, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Elektrik & Su Faturası", Amount = 1800, TransactionType = TransactionType.Expense, Category = "Ev Kirası & Barınma", PaymentMethod = "Otomatik Ödeme", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 7, 8, 11, 0, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Doğalgaz Faturası", Amount = 2200, TransactionType = TransactionType.Expense, Category = "Ev Kirası & Barınma", PaymentMethod = "Otomatik Ödeme", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 7, 12, 11, 0, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Ev İnterneti & TV Paketi", Amount = 850, TransactionType = TransactionType.Expense, Category = "Ev Kirası & Barınma", PaymentMethod = "Otomatik Ödeme", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 7, 14, 15, 20, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "GSM Telefon Faturası", Amount = 1200, TransactionType = TransactionType.Expense, Category = "Ev Kirası & Barınma", PaymentMethod = "Otomatik Ödeme", Account = "Garanti BBVA", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 7, 15, 16, 0, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Hafta Sonu Restoran & Eğlence", Amount = 6500, TransactionType = TransactionType.Expense, Category = "Restoran & Eğlence", PaymentMethod = "Kredi Kartı", Account = "Bonus Card", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 7, 18, 20, 30, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Benzin Yakıt Alımı", Amount = 4200, TransactionType = TransactionType.Expense, Category = "Ulaşım & Yakıt", PaymentMethod = "Kredi Kartı", Account = "Maximum Card", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 7, 20, 18, 15, 0), DateTimeKind.Utc) },
            new Transaction { UserId = userId, Description = "Aylık Dijital Abonelikler Toplamı", Amount = 3748, TransactionType = TransactionType.Expense, Category = "Abonelikler & Yazılım", PaymentMethod = "Kredi Kartı", Account = "Bonus Card", TransactionDate = DateTime.SpecifyKind(new DateTime(2026, 7, 22, 10, 0, 0), DateTimeKind.Utc) }
        };

        foreach (var t in sampleTransactions)
        {
            await _unitOfWork.Transactions.AddAsync(t);
        }

        var currentMonthStart = DateTime.SpecifyKind(new DateTime(2026, 7, 1), DateTimeKind.Utc);

        var sampleBudgets = new[]
        {
            new Budget { UserId = userId, Category = "Market & Gıda", Limit = 15000, Month = currentMonthStart },
            new Budget { UserId = userId, Category = "Ev Kirası & Barınma", Limit = 35000, Month = currentMonthStart },
            new Budget { UserId = userId, Category = "Restoran & Eğlence", Limit = 10000, Month = currentMonthStart },
            new Budget { UserId = userId, Category = "Ulaşım & Yakıt", Limit = 8000, Month = currentMonthStart }
        };

        foreach (var b in sampleBudgets)
        {
            await _unitOfWork.Budgets.AddAsync(b);
        }

        var sampleGoals = new[]
        {
            new Goal { UserId = userId, Name = "Ev Peşinatı Fonu", TargetAmount = 500000, CurrentAmount = 320000, Category = "Yatırım & Gayrimenkul", Deadline = DateTime.SpecifyKind(new DateTime(2027, 6, 30), DateTimeKind.Utc) },
            new Goal { UserId = userId, Name = "Acil Durum Fonu", TargetAmount = 150000, CurrentAmount = 100000, Category = "Tasarruf", Deadline = DateTime.SpecifyKind(new DateTime(2026, 12, 31), DateTimeKind.Utc) },
            new Goal { UserId = userId, Name = "Yaz Tatili Bütçesi", TargetAmount = 60000, CurrentAmount = 45000, Category = "Seyahat", Deadline = DateTime.SpecifyKind(new DateTime(2026, 9, 15), DateTimeKind.Utc) }
        };

        foreach (var g in sampleGoals)
        {
            await _unitOfWork.Goals.AddAsync(g);
        }

        var sampleSubscriptions = new[]
        {
            new Subscription { UserId = userId, Name = "Spotify Family", Price = 149, BillingCycle = "Monthly", Category = "Müzik", IsActive = true, NextBillingDate = DateTime.SpecifyKind(new DateTime(2026, 8, 5), DateTimeKind.Utc) },
            new Subscription { UserId = userId, Name = "Netflix Premium", Price = 449, BillingCycle = "Monthly", Category = "Eğlence", IsActive = true, NextBillingDate = DateTime.SpecifyKind(new DateTime(2026, 8, 10), DateTimeKind.Utc) },
            new Subscription { UserId = userId, Name = "ChatGPT / Claude AI Pro", Price = 950, BillingCycle = "Monthly", Category = "Yazılım", IsActive = true, NextBillingDate = DateTime.SpecifyKind(new DateTime(2026, 8, 15), DateTimeKind.Utc) },
            new Subscription { UserId = userId, Name = "MacFit Spor Salonu", Price = 2200, BillingCycle = "Monthly", Category = "Sağlık", IsActive = true, NextBillingDate = DateTime.SpecifyKind(new DateTime(2026, 8, 20), DateTimeKind.Utc) }
        };

        foreach (var s in sampleSubscriptions)
        {
            await _unitOfWork.Subscriptions.AddAsync(s);
        }

        var sampleAssets = new[]
        {
            new PortfolioAsset { UserId = userId, Name = "Gram Altın", Symbol = "ALTIN", Amount = 85, PurchasePrice = 2400, CurrentPrice = 3100, AssetType = AssetType.Gold },
            new PortfolioAsset { UserId = userId, Name = "Türk Hava Yolları", Symbol = "THYAO", Amount = 400, PurchasePrice = 240, CurrentPrice = 320, AssetType = AssetType.Stock },
            new PortfolioAsset { UserId = userId, Name = "Apple Inc.", Symbol = "AAPL", Amount = 15, PurchasePrice = 180, CurrentPrice = 230, AssetType = AssetType.Stock },
            new PortfolioAsset { UserId = userId, Name = "Bitcoin", Symbol = "BTC", Amount = 0.05m, PurchasePrice = 55000, CurrentPrice = 68000, AssetType = AssetType.Crypto }
        };

        foreach (var a in sampleAssets)
        {
            await _unitOfWork.PortfolioAssets.AddAsync(a);
        }

        var sampleLogs = new[]
        {
            new ActivityLog { UserId = userId, Action = "Demo Yükleme", ActivityType = "System", Title = "2026 Production Verileri Yüklendi", Description = "Kullanıcı 2026 dönemi güncel finansal veri setini başarıyla yükledi.", Category = "Onboarding", Status = "success" },
            new ActivityLog { UserId = userId, Action = "Bütçe Yapılandırma", ActivityType = "Budget", Title = "2026 Bütçeleri Güncellendi", Description = "Aylık mutfak, kira, eğlence ve ulaşım bütçeleri tanımlandı.", Category = "Budget", Status = "info" }
        };

        foreach (var l in sampleLogs)
        {
            await _unitOfWork.ActivityLogs.AddAsync(l);
        }

        var sampleNotifications = new[]
        {
            new Notification { UserId = userId, Title = "Hoş Geldiniz!", Message = "FinanceFocus 2026 Production sistemi hazır. Tüm verileriniz tek kaynak üzerinden senkronize edilmektedir.", Type = NotificationType.Info, IsRead = false, Category = "System" },
            new Notification { UserId = userId, Title = "Yaklaşan Abonelik Ödemesi", Message = "Spotify Family abonelik ödemenize 12 gün kaldı.", Type = NotificationType.Warning, IsRead = false, Category = "Subscription" }
        };

        foreach (var n in sampleNotifications)
        {
            await _unitOfWork.Notifications.AddAsync(n);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<bool>.Success(true, "2026 Production demo verileri başarıyla yüklendi.");
    }
}
