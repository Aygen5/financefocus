import type { UserDto } from "@/api/authApi";
import type { TransactionDto } from "@/api/transactionApi";
import type { BudgetDto } from "@/api/budgetApi";
import type { GoalDto } from "@/api/goalApi";
import type { PortfolioAssetDto } from "@/api/portfolioApi";
import type { SubscriptionDto } from "@/api/subscriptionApi";

export const mockUser: UserDto = {
  id: "1",
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  role: "User",
};

export const mockTransaction: TransactionDto = {
  id: "1",
  description: "Market Harcaması",
  amount: 450,
  transactionDate: "2026-07-20T10:00:00Z",
  category: "Market",
  transactionType: 1,
  paymentMethod: "Kredi Kartı",
  account: "Ana Hesap",
  userId: "1",
};

export const mockBudget: BudgetDto = {
  id: "1",
  category: "Market",
  limit: 15000,
  spentAmount: 12500,
  month: "2026-07-01T00:00:00Z",
  userId: "1",
};

export const mockGoal: GoalDto = {
  id: "1",
  name: "Acil Durum Fonu",
  targetAmount: 50000,
  currentAmount: 25000,
  deadline: "2026-12-31T00:00:00Z",
  category: "Birikim",
  progressPercentage: 50,
  userId: "1",
};

export const mockPortfolioAsset: PortfolioAssetDto = {
  id: "1",
  name: "Türk Hava Yolları",
  symbol: "THYAO",
  amount: 100,
  purchasePrice: 100,
  currentPrice: 150,
  assetType: 0,
  totalInvestment: 10000,
  currentValue: 15000,
  profitLoss: 5000,
  profitLossPercentage: 50,
  userId: "1",
};

export const mockSubscription: SubscriptionDto = {
  id: "1",
  name: "Netflix",
  price: 200,
  billingCycle: "Monthly",
  nextBillingDate: "2026-08-01T00:00:00Z",
  category: "Eğlence",
  isActive: true,
  monthlyEquivalentPrice: 200,
  userId: "1",
};
