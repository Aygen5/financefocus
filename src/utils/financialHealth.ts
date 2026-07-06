import { parseISO, startOfMonth, subMonths } from "date-fns";

export interface HealthTransaction {
  amount: number;
  transactionType: "income" | "expense" | "neutral";
  date: string;
  category: string;
}

export interface HealthAsset {
  type: string;
  amount: number;
  avgCost: number;
  currentPrice: number;
  currency: string;
  name: string;
  symbol: string;
}

export interface HealthBudget {
  spentAmount: number;
  limitAmount: number;
  category: string;
}

export interface HealthSubscription {
  cost: number;
  billingCycle: "monthly" | "yearly";
}

export interface HealthGoal {
  title: string;
  category: string;
  currentAmount: number;
  targetAmount: number;
}

export interface FinancialHealthBreakdown {
  overallScore: number;
  savingsRateScore: number;
  debtRatioScore: number;
  burnRateScore: number;
  emergencyFundScore: number;
  investmentRatioScore: number;
  budgetDisciplineScore: number;
  subscriptionLoadScore: number;

  // Real values for stats
  savingsRate: number;
  debtRatio: number;
  monthlyBurnRate: number;
  emergencyFundProgress: number;
  investmentRatio: number;
  budgetUsage: number;
  subscriptionLoad: number;
  incomeExpenseRatio: number;
}

/**
 * Toplam Geliri hesaplar.
 */
export const calculateTotalIncome = (transactions: HealthTransaction[]): number => {
  return transactions
    .filter((t) => t.transactionType === "income")
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Toplam Gideri hesaplar.
 */
export const calculateTotalExpenses = (transactions: HealthTransaction[]): number => {
  return transactions
    .filter((t) => t.transactionType === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Aylık Toplam Abonelik Maliyetini hesaplar.
 */
export const calculateMonthlySubscriptionTotal = (subscriptions: HealthSubscription[]): number => {
  return subscriptions.reduce((sum, sub) => {
    if (sub.billingCycle === "yearly") {
      return sum + sub.cost / 12;
    }
    return sum + sub.cost;
  }, 0);
};

/**
 * Genel finansal sağlık skorunu ve alt bileşen analizini hesaplar (calculateFinancialHealthScore).
 */
export const calculateFinancialHealth = (
  transactions: HealthTransaction[],
  budgets: HealthBudget[],
  assets: HealthAsset[],
  goals: HealthGoal[],
  subscriptions: HealthSubscription[],
): FinancialHealthBreakdown => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpense = calculateTotalExpenses(transactions);

  // 1. Income / Expense Ratio & Savings Rate
  const incomeExpenseRatio = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 100;
  const savingsRate =
    totalIncome > 0
      ? Math.max(Math.round(((totalIncome - totalExpense) / totalIncome) * 100), 0)
      : 0;

  let savingsRateScore = 30;
  if (savingsRate >= 40) savingsRateScore = 100;
  else if (savingsRate >= 25) savingsRateScore = 85;
  else if (savingsRate >= 15) savingsRateScore = 65;
  else if (savingsRate >= 5) savingsRateScore = 45;

  // 2. Debt Ratio
  // Borç / Gelir Oranı: Borç veya Kredi Ödeme işlemlerini (Debt/Loan) veya Bills kategorisinin bir bölümünü varsayabiliriz.
  const debtTxSum = transactions
    .filter(
      (t) =>
        t.category.toLowerCase().includes("debt") ||
        t.category.toLowerCase().includes("borç") ||
        t.category.toLowerCase().includes("loan") ||
        t.category.toLowerCase().includes("kredi"),
    )
    .reduce((s, t) => s + t.amount, 0);

  const debtRatio = totalIncome > 0 ? Math.round((debtTxSum / totalIncome) * 100) : 5; // Default low if none
  let debtRatioScore = 100;
  if (debtRatio > 40) debtRatioScore = 30;
  else if (debtRatio > 25) debtRatioScore = 55;
  else if (debtRatio > 15) debtRatioScore = 75;
  else if (debtRatio > 5) debtRatioScore = 90;

  // 3. Monthly Burn Rate (Aylık Harcama Hızı)
  // Son 3 ayın ortalama harcaması
  const today = new Date();
  const threeMonthsAgo = startOfMonth(subMonths(today, 2));
  const recentExpenses = transactions.filter((t) => {
    const txDate = parseISO(t.date);
    return t.transactionType === "expense" && txDate >= threeMonthsAgo;
  });
  const burnSum = recentExpenses.reduce((s, t) => s + t.amount, 0);
  const monthlyBurnRate =
    burnSum > 0 ? Math.round(burnSum / 3) : Math.round(totalExpense / 2 || 4000);

  const burnRateScore =
    totalIncome > 0 && monthlyBurnRate > 0
      ? Math.min(Math.round((totalIncome / monthlyBurnRate) * 25), 100)
      : 70;

  // 4. Emergency Fund Status
  const emergencyGoal = goals.find(
    (g) => g.title.toLowerCase().includes("acil") || g.category.toLowerCase().includes("acil"),
  );
  const emergencyFundProgress = emergencyGoal
    ? Math.min(Math.round((emergencyGoal.currentAmount / emergencyGoal.targetAmount) * 100), 100)
    : 35; // Default low progress warning if no goal exists

  const emergencyFundScore = emergencyFundProgress;

  // 5. Investment Allocation / Ratio
  // Portföyün toplam değeri / Toplam Gelir (Yıllık bazda tasarrufa katkısı)
  const portfolioTotalVal = assets.reduce((s, a) => {
    const assetVal = a.amount * a.currentPrice;
    return s + (a.currency === "USD" ? assetVal * 34.0 : assetVal);
  }, 0);

  const investmentRatio =
    totalIncome > 0 ? Math.round((portfolioTotalVal / (totalIncome * 6)) * 100) : 10;
  let investmentRatioScore = 40;
  if (investmentRatio >= 80) investmentRatioScore = 100;
  else if (investmentRatio >= 50) investmentRatioScore = 85;
  else if (investmentRatio >= 25) investmentRatioScore = 65;
  else if (investmentRatio >= 10) investmentRatioScore = 50;

  // 6. Budget Discipline
  let budgetDisciplineScore = 80;
  let totalBudgetSpent = 0;
  let totalBudgetLimit = 0;

  if (budgets.length > 0) {
    budgets.forEach((b) => {
      totalBudgetSpent += b.spentAmount;
      totalBudgetLimit += b.limitAmount;
    });
    const avgUsage = totalBudgetLimit > 0 ? (totalBudgetSpent / totalBudgetLimit) * 100 : 0;
    if (avgUsage <= 80) budgetDisciplineScore = 100;
    else if (avgUsage <= 100) budgetDisciplineScore = 85;
    else if (avgUsage <= 120) budgetDisciplineScore = 55;
    else budgetDisciplineScore = 25;
  }
  const budgetUsage =
    totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0;

  // 7. Subscription Load
  const monthlySubs = calculateMonthlySubscriptionTotal(subscriptions);
  const subscriptionLoad = totalIncome > 0 ? Math.round((monthlySubs / totalIncome) * 100) : 2;

  let subscriptionLoadScore = 100;
  if (subscriptionLoad > 15) subscriptionLoadScore = 30;
  else if (subscriptionLoad > 10) subscriptionLoadScore = 55;
  else if (subscriptionLoad > 5) subscriptionLoadScore = 75;
  else if (subscriptionLoad > 2) subscriptionLoadScore = 90;

  // Ağırlıklı genel sağlık skoru (0-100)
  const overallScore = Math.round(
    savingsRateScore * 0.25 +
      debtRatioScore * 0.15 +
      burnRateScore * 0.15 +
      emergencyFundScore * 0.15 +
      investmentRatioScore * 0.15 +
      budgetDisciplineScore * 0.15,
  );

  return {
    overallScore,
    savingsRateScore,
    debtRatioScore,
    burnRateScore,
    emergencyFundScore,
    investmentRatioScore,
    budgetDisciplineScore,
    subscriptionLoadScore,
    savingsRate,
    debtRatio,
    monthlyBurnRate,
    emergencyFundProgress,
    investmentRatio,
    budgetUsage,
    subscriptionLoad,
    incomeExpenseRatio,
  };
};

/**
 * Puan dilimine göre durum etiketi ve renk şeması üretir.
 */
export const getHealthStatus = (score: number) => {
  if (score >= 90)
    return {
      label: "Excellent",
      color: "text-emerald-600 dark:text-emerald-450",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      fill: "#16a34a",
    };
  if (score >= 75)
    return {
      label: "Good",
      color: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
      fill: "#004ac6",
    };
  if (score >= 60)
    return {
      label: "Fair",
      color: "text-amber-500 dark:text-amber-450",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      fill: "#d97706",
    };
  if (score >= 40)
    return {
      label: "Warning",
      color: "text-orange-500 dark:text-orange-450",
      border: "border-orange-500/30",
      bg: "bg-orange-500/10",
      fill: "#ea580c",
    };
  return {
    label: "Critical",
    color: "text-red-650 dark:text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    fill: "#dc2626",
  };
};
