/* eslint-disable no-console */
import {
  parseISO,
  format,
  subMonths,
  addMonths,
  isAfter,
  startOfDay,
  endOfDay,
  startOfMonth,
  differenceInCalendarMonths,
  differenceInDays,
} from "date-fns";
import { tr } from "date-fns/locale";

export interface FinancialTransaction {
  amount: number;
  transactionType: "income" | "expense" | "neutral";
  date: string;
  category: string;
}

export interface FinancialAsset {
  type: "stocks" | "gold" | "silver" | "crypto" | "fund" | "etf" | "cash";
  amount: number;
  avgCost: number;
  currentPrice: number;
  currency: string;
  name: string;
  symbol: string;
  sector: string;
}

export interface FinancialBudget {
  spentAmount: number;
  limitAmount: number;
  category: string;
}

export interface FinancialSubscription {
  id: string;
  userId?: string;
  name: string;
  cost: number;
  billingCycle: "monthly" | "yearly";
  nextBillingDate: string;
  category: string;
  color?: string;
  icon?: string;
  status?: "active" | "paused" | "cancelled";
}

export interface FinancialGoal {
  currentAmount: number;
  targetAmount: number;
}

const USD_TO_TRY_RATE = 34.0;

export const formatCurrency = (amount: number, _currency = "TRY", _locale = "tr-TR"): string => {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error("Format Currency Error:", error);
    return `${amount.toFixed(2)} ₺`;
  }
};

export const calculatePercentage = (value: number, total: number): number => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const calculateTrend = (current: number, previous: number): number => {
  if (!previous || previous === 0) return 0;
  const change = current - previous;
  return Number(((change / previous) * 100).toFixed(1));
};

export const formatCompactNumber = (amount: number, locale = "tr-TR"): string => {
  try {
    return new Intl.NumberFormat(locale, {
      notation: "compact",
      compactDisplay: "short",
    }).format(amount);
  } catch (error) {
    console.error("Format Compact Number Error:", error);
    return amount.toString();
  }
};

export const calculateAssetCost = (asset: FinancialAsset): number => {
  return asset.amount * asset.avgCost;
};

export const calculateAssetValue = (asset: FinancialAsset, usdRate = USD_TO_TRY_RATE): number => {
  const localValue = asset.amount * asset.currentPrice;
  if (asset.currency === "USD") {
    return localValue * usdRate;
  }
  return localValue;
};

export const calculateAssetCostInBaseCurrency = (
  asset: FinancialAsset,
  usdRate = USD_TO_TRY_RATE,
): number => {
  const localCost = asset.amount * asset.avgCost;
  if (asset.currency === "USD") {
    return localCost * usdRate;
  }
  return localCost;
};

export const calculateAssetProfitLoss = (
  asset: FinancialAsset,
  usdRate = USD_TO_TRY_RATE,
): number => {
  const currentValue = calculateAssetValue(asset, usdRate);
  const totalCost = calculateAssetCostInBaseCurrency(asset, usdRate);
  return currentValue - totalCost;
};

export const calculateAssetPercentageChange = (asset: FinancialAsset): number => {
  if (!asset.avgCost || asset.avgCost === 0) return 0;
  return Number((((asset.currentPrice - asset.avgCost) / asset.avgCost) * 100).toFixed(2));
};

export const calculateNetWorth = (assets: FinancialAsset[], usdRate = USD_TO_TRY_RATE): number => {
  return assets.reduce((sum, asset) => sum + calculateAssetValue(asset, usdRate), 0);
};

export const calculateTotalPortfolioCost = (
  assets: FinancialAsset[],
  usdRate = USD_TO_TRY_RATE,
): number => {
  return assets.reduce((sum, asset) => sum + calculateAssetCostInBaseCurrency(asset, usdRate), 0);
};

export const calculateTotalPortfolioProfitLoss = (
  assets: FinancialAsset[],
  usdRate = USD_TO_TRY_RATE,
): number => {
  const totalValue = calculateNetWorth(assets, usdRate);
  const totalCost = calculateTotalPortfolioCost(assets, usdRate);
  return totalValue - totalCost;
};

export const calculateTotalPortfolioChangeRate = (
  assets: FinancialAsset[],
  usdRate = USD_TO_TRY_RATE,
): number => {
  const totalCost = calculateTotalPortfolioCost(assets, usdRate);
  if (!totalCost || totalCost === 0) return 0;
  const totalProfitLoss = calculateTotalPortfolioProfitLoss(assets, usdRate);
  return Number(((totalProfitLoss / totalCost) * 100).toFixed(2));
};

export const calculateLargestAsset = (
  assets: FinancialAsset[],
  usdRate = USD_TO_TRY_RATE,
): FinancialAsset | null => {
  if (assets.length === 0) return null;
  return assets.reduce((largest, current) => {
    const largestVal = calculateAssetValue(largest, usdRate);
    const currentVal = calculateAssetValue(current, usdRate);
    return currentVal > largestVal ? current : largest;
  });
};

export const calculateMostProfitableAsset = (
  assets: FinancialAsset[],
  usdRate = USD_TO_TRY_RATE,
): { name: string; profit: number } | null => {
  if (assets.length === 0) return null;
  const withProfit = assets.map((a) => ({
    name: a.name,
    profit: calculateAssetProfitLoss(a, usdRate),
  }));
  return withProfit.reduce((most, current) => (current.profit > most.profit ? current : most));
};

export const calculatePortfolioAssetAllocation = (
  assets: FinancialAsset[],
  usdRate = USD_TO_TRY_RATE,
): { name: string; value: number }[] => {
  const typeMap: { [key: string]: number } = {};

  assets.forEach((asset) => {
    const value = calculateAssetValue(asset, usdRate);
    let typeName = "Diğer";
    switch (asset.type) {
      case "stocks":
        typeName = asset.currency === "USD" ? "ABD Hisseleri" : "BIST Hisseleri";
        break;
      case "gold":
        typeName = "Altın";
        break;
      case "silver":
        typeName = "Gümüş";
        break;
      case "crypto":
        typeName = "Kripto";
        break;
      case "fund":
        typeName = "Fon";
        break;
      case "etf":
        typeName = "ETF";
        break;
      case "cash":
        typeName = "Döviz";
        break;
    }

    typeMap[typeName] = (typeMap[typeName] || 0) + value;
  });

  return Object.entries(typeMap).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));
};

export const calculatePortfolioSectorDistribution = (
  assets: FinancialAsset[],
  usdRate = USD_TO_TRY_RATE,
): { name: string; value: number }[] => {
  const sectorMap: { [key: string]: number } = {};

  assets.forEach((asset) => {
    const value = calculateAssetValue(asset, usdRate);
    const name = asset.sector || "Diğer";
    sectorMap[name] = (sectorMap[name] || 0) + value;
  });

  return Object.entries(sectorMap).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));
};

export const calculateTotalIncome = (transactions: FinancialTransaction[]): number => {
  return transactions
    .filter((t) => t.transactionType === "income")
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalExpenses = (transactions: FinancialTransaction[]): number => {
  return transactions
    .filter((t) => t.transactionType === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
};

export const generateIncomeReport = (
  transactions: FinancialTransaction[],
  startDate: Date,
  endDate: Date,
): number => {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);

  return transactions
    .filter((t) => {
      const txDate = parseISO(t.date);
      return t.transactionType === "income" && txDate >= start && txDate <= end;
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

export const generateExpenseReport = (
  transactions: FinancialTransaction[],
  startDate: Date,
  endDate: Date,
): number => {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);

  return transactions
    .filter((t) => {
      const txDate = parseISO(t.date);
      return t.transactionType === "expense" && txDate >= start && txDate <= end;
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateMostSpentCategory = (
  transactions: FinancialTransaction[],
  startDate: Date,
  endDate: Date,
): { name: string; amount: number } | null => {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);

  const categoryMap: { [key: string]: number } = {};

  transactions
    .filter((t) => {
      const txDate = parseISO(t.date);
      return t.transactionType === "expense" && txDate >= start && txDate <= end;
    })
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const entries = Object.entries(categoryMap);
  if (entries.length === 0) return null;

  const [name, amount] = entries.reduce((max, current) => (current[1] > max[1] ? current : max));
  return { name, amount };
};

export const calculateAverageMonthlySpending = (transactions: FinancialTransaction[]): number => {
  const expenseTxs = transactions.filter((t) => t.transactionType === "expense");
  if (expenseTxs.length === 0) return 0;

  const monthsMap: { [key: string]: number } = {};
  expenseTxs.forEach((t) => {
    const key = format(parseISO(t.date), "yyyy-MM");
    monthsMap[key] = (monthsMap[key] || 0) + t.amount;
  });

  const monthlyTotals = Object.values(monthsMap);
  if (monthlyTotals.length === 0) return 0;
  const sum = monthlyTotals.reduce((a, b) => a + b, 0);
  return Math.round(sum / monthlyTotals.length);
};

export const calculateNetBalance = (income: number, expense: number): number => {
  return income - expense;
};

export const calculateSavingsRate = (income: number, expense: number): number => {
  if (!income || income === 0) return 0;
  const savings = Math.max(income - expense, 0);
  return Math.round((savings / income) * 100);
};

export const calculateExpenseRatio = (income: number, expense: number): number => {
  if (!income || income === 0) return 0;
  return Math.round((expense / income) * 100);
};

export const calculateBudgetUsage = (spent: number, limit: number): number => {
  if (!limit || limit === 0) return 0;
  return Math.round((spent / limit) * 100);
};

export const calculateMonthlySubscriptionTotal = (
  subscriptions: FinancialSubscription[],
): number => {
  return subscriptions.reduce((sum, sub) => {
    if (sub.billingCycle === "yearly") {
      return sum + sub.cost / 12;
    }
    return sum + sub.cost;
  }, 0);
};

export const calculateYearlySubscriptionTotal = (
  subscriptions: FinancialSubscription[],
): number => {
  return subscriptions.reduce((sum, sub) => {
    if (sub.billingCycle === "monthly") {
      return sum + sub.cost * 12;
    }
    return sum + sub.cost;
  }, 0);
};

export const calculateAverageSubscriptionCost = (
  subscriptions: FinancialSubscription[],
): number => {
  if (subscriptions.length === 0) return 0;
  const totalMonthly = calculateMonthlySubscriptionTotal(subscriptions);
  return Number((totalMonthly / subscriptions.length).toFixed(2));
};

export const calculateMostExpensiveSubscription = (
  subscriptions: FinancialSubscription[],
): FinancialSubscription | null => {
  if (subscriptions.length === 0) return null;
  return subscriptions.reduce((mostExpensive, current) => {
    const currentMonthly = current.billingCycle === "yearly" ? current.cost / 12 : current.cost;
    const mostExpensiveMonthly =
      mostExpensive.billingCycle === "yearly" ? mostExpensive.cost / 12 : mostExpensive.cost;
    return currentMonthly > mostExpensiveMonthly ? current : mostExpensive;
  });
};

export const calculateUpcomingPayments = (
  subscriptions: FinancialSubscription[],
): FinancialSubscription[] => {
  return [...subscriptions].sort((a, b) => {
    try {
      return parseISO(a.nextBillingDate).getTime() - parseISO(b.nextBillingDate).getTime();
    } catch {
      return 0;
    }
  });
};

export const calculateSubscriptionCategoryTotals = (
  subscriptions: FinancialSubscription[],
): { name: string; value: number }[] => {
  const categoryMap: { [key: string]: number } = {};

  subscriptions.forEach((sub) => {
    const monthlyCost = sub.billingCycle === "yearly" ? sub.cost / 12 : sub.cost;
    categoryMap[sub.category] = (categoryMap[sub.category] || 0) + monthlyCost;
  });

  return Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));
};

export const calculateCategoryExpenseDistribution = (
  transactions: FinancialTransaction[],
  startDate: Date,
  endDate: Date,
): { name: string; value: number }[] => {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);
  const categoryMap: { [key: string]: number } = {};

  transactions
    .filter((t) => {
      const txDate = parseISO(t.date);
      return t.transactionType === "expense" && txDate >= start && txDate <= end;
    })
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  return Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));
};

export const calculateMonthlyCashFlow = (
  transactions: FinancialTransaction[],
): { month: string; income: number; expense: number }[] => {
  const today = new Date();
  const monthsData: { [key: string]: { income: number; expense: number } } = {};

  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(today, i);
    const key = format(monthDate, "yyyy-MM");
    monthsData[key] = { income: 0, expense: 0 };
  }

  const sixMonthsAgo = startOfMonth(subMonths(today, 5));

  transactions.forEach((tx) => {
    const txDate = parseISO(tx.date);
    if (
      isAfter(txDate, sixMonthsAgo) ||
      format(txDate, "yyyy-MM") === format(sixMonthsAgo, "yyyy-MM")
    ) {
      const key = format(txDate, "yyyy-MM");
      if (monthsData[key]) {
        if (tx.transactionType === "income") {
          monthsData[key].income += tx.amount;
        } else if (tx.transactionType === "expense") {
          monthsData[key].expense += tx.amount;
        }
      }
    }
  });

  return Object.entries(monthsData).map(([key, data]) => {
    const parsed = parseISO(`${key}-01`);
    const label = format(parsed, "MMM yy", { locale: tr });
    return {
      month: label,
      income: Math.round(data.income),
      expense: Math.round(data.expense),
    };
  });
};

export const calculateIncomeExpenseTrend = (
  transactions: FinancialTransaction[],
  startDate: Date,
  endDate: Date,
): { date: string; income: number; expense: number }[] => {
  const start = startOfDay(startDate);
  const end = endOfDay(endDate);
  const dateMap: { [key: string]: { income: number; expense: number } } = {};

  transactions
    .filter((t) => {
      const txDate = parseISO(t.date);
      return txDate >= start && txDate <= end;
    })
    .forEach((t) => {
      const dateKey = format(parseISO(t.date), "dd MMM", { locale: tr });
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { income: 0, expense: 0 };
      }
      if (t.transactionType === "income") {
        dateMap[dateKey].income += t.amount;
      } else if (t.transactionType === "expense") {
        dateMap[dateKey].expense += t.amount;
      }
    });

  return Object.entries(dateMap).map(([date, data]) => ({
    date,
    income: Math.round(data.income),
    expense: Math.round(data.expense),
  }));
};

export const calculateGoalProgress = (current: number, target: number): number => {
  if (!target || target === 0) return 0;
  const percentage = Math.round((current / target) * 100);
  return Math.min(percentage, 100);
};

export const calculateGoalRemainingAmount = (current: number, target: number): number => {
  return Math.max(target - current, 0);
};

export const calculateGoalRemainingMonths = (targetDateStr: string): number => {
  try {
    const today = new Date();
    const targetDate = parseISO(targetDateStr);
    const diff = differenceInCalendarMonths(targetDate, today);
    return Math.max(diff, 0);
  } catch {
    return 0;
  }
};

export const calculateGoalRequiredMonthlySaving = (
  remainingAmount: number,
  remainingMonths: number,
): number => {
  if (remainingMonths <= 0) return remainingAmount;
  return Math.round(remainingAmount / remainingMonths);
};

export const calculateDaysDifference = (dateStr: string): number => {
  try {
    const today = new Date();
    const targetDate = parseISO(dateStr);
    return differenceInDays(targetDate, today);
  } catch {
    return 999;
  }
};

export const forecastIncome = (
  transactions: FinancialTransaction[],
  months: number,
): { month: string; value: number }[] => {
  const today = new Date();
  const threeMonthsAgo = startOfMonth(subMonths(today, 2));
  const recentIncomes = transactions.filter((t) => {
    const txDate = parseISO(t.date);
    return t.transactionType === "income" && txDate >= threeMonthsAgo;
  });

  const sum = recentIncomes.reduce((s, t) => s + t.amount, 0);
  const avgMonthlyIncome = sum > 0 ? Math.round(sum / 3) : 12000;

  const result: { month: string; value: number }[] = [];
  for (let i = 1; i <= months; i++) {
    const forecastMonth = addMonths(today, i);
    result.push({
      month: format(forecastMonth, "MMM yy", { locale: tr }),
      value: avgMonthlyIncome,
    });
  }
  return result;
};

export const forecastExpenses = (
  transactions: FinancialTransaction[],
  months: number,
): { month: string; value: number }[] => {
  const today = new Date();
  const threeMonthsAgo = startOfMonth(subMonths(today, 2));
  const recentExpenses = transactions.filter((t) => {
    const txDate = parseISO(t.date);
    return t.transactionType === "expense" && txDate >= threeMonthsAgo;
  });

  const sum = recentExpenses.reduce((s, t) => s + t.amount, 0);
  const avgMonthlyExpense = sum > 0 ? Math.round(sum / 3) : 6500;

  const result: { month: string; value: number }[] = [];
  for (let i = 1; i <= months; i++) {
    const forecastMonth = addMonths(today, i);
    result.push({
      month: format(forecastMonth, "MMM yy", { locale: tr }),
      value: avgMonthlyExpense,
    });
  }
  return result;
};

export const forecastCashFlow = (
  transactions: FinancialTransaction[],
  months: number,
): { month: string; income: number; expense: number }[] => {
  const incomes = forecastIncome(transactions, months);
  const expenses = forecastExpenses(transactions, months);

  return incomes.map((inc, index) => ({
    month: inc.month,
    income: inc.value,
    expense: expenses[index].value,
  }));
};

export const forecastSavings = (income: number, expense: number, months: number): number => {
  const monthlySavings = Math.max(income - expense, 0);
  return monthlySavings * months;
};

export const forecastPortfolioGrowth = (
  assets: FinancialAsset[],
  transactions: FinancialTransaction[],
  months: number,
  usdRate = USD_TO_TRY_RATE,
): { month: string; value: number }[] => {
  const today = new Date();
  const currentVal = calculateNetWorth(assets, usdRate);

  const incomes = forecastIncome(transactions, 3);
  const expenses = forecastExpenses(transactions, 3);
  const avgMonthlySavings = Math.max(incomes[0].value - expenses[0].value, 0);

  const result: { month: string; value: number }[] = [];
  let runningPortfolioVal = currentVal;

  for (let i = 1; i <= months; i++) {
    const forecastMonth = addMonths(today, i);
    runningPortfolioVal = Math.round(runningPortfolioVal * 1.012 + avgMonthlySavings);
    result.push({
      month: format(forecastMonth, "MMM yy", { locale: tr }),
      value: runningPortfolioVal,
    });
  }

  return result;
};

export const calculateBudgetHealth = (budgets: FinancialBudget[]): number => {
  if (budgets.length === 0) return 80;

  let totalUsage = 0;
  budgets.forEach((b) => {
    const usage = b.limitAmount > 0 ? (b.spentAmount / b.limitAmount) * 100 : 0;
    totalUsage += usage;
  });

  const avgUsage = totalUsage / budgets.length;
  if (avgUsage <= 85) return 100;
  if (avgUsage <= 100) return 85;
  if (avgUsage <= 120) return 60;
  return 30; // Ciddi bütçe aşımı
};

export const calculateInvestmentHealth = (assets: FinancialAsset[]): number => {
  if (assets.length === 0) return 20;

  const types = new Set(assets.map((a) => a.type));
  const distinctCount = types.size;

  if (distinctCount >= 4) return 100;
  if (distinctCount === 3) return 85;
  if (distinctCount === 2) return 65;
  return 45;
};

export const calculateSubscriptionHealth = (
  subscriptions: FinancialSubscription[],
  totalIncome: number,
): number => {
  if (subscriptions.length === 0) return 100;
  if (!totalIncome || totalIncome === 0) return 50;

  const monthlySubs = calculateMonthlySubscriptionTotal(subscriptions);
  const ratio = (monthlySubs / totalIncome) * 100;

  if (ratio <= 2) return 100;
  if (ratio <= 5) return 85;
  if (ratio <= 10) return 65;
  if (ratio <= 15) return 45;
  return 25; // Ciddi yük
};

export const calculateGoalHealth = (goals: FinancialGoal[]): number => {
  if (goals.length === 0) return 80; // baseline

  let totalProgress = 0;
  goals.forEach((g) => {
    totalProgress += calculateGoalProgress(g.currentAmount, g.targetAmount);
  });

  const avgProgress = totalProgress / goals.length;
  if (avgProgress >= 70) return 100;
  if (avgProgress >= 50) return 85;
  if (avgProgress >= 30) return 65;
  return 45;
};

export const calculateFinancialHealthScore = (
  transactions: FinancialTransaction[],
  budgets: FinancialBudget[],
  assets: FinancialAsset[],
  goals: FinancialGoal[],
  subscriptions: FinancialSubscription[],
): {
  overall: number;
  savings: number;
  budget: number;
  investment: number;
  goal: number;
  subscription: number;
} => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpense = calculateTotalExpenses(transactions);

  const savingsRate = calculateSavingsRate(totalIncome, totalExpense);
  let savings = 30;
  if (savingsRate >= 40) savings = 100;
  else if (savingsRate >= 25) savings = 85;
  else if (savingsRate >= 15) savings = 65;
  else if (savingsRate >= 0) savings = 45;

  const budget = calculateBudgetHealth(budgets);

  const investment = calculateInvestmentHealth(assets);

  const goal = calculateGoalHealth(goals);

  const subscription = calculateSubscriptionHealth(subscriptions, totalIncome);

  const overall = Math.round(
    savings * 0.25 + budget * 0.2 + investment * 0.2 + goal * 0.15 + subscription * 0.2,
  );

  return {
    overall,
    savings,
    budget,
    investment,
    goal,
    subscription,
  };
};
