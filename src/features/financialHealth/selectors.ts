import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";
import { calculateFinancialHealth } from "@/utils/financialHealth";

// Base selectors
const selectTransactions = (state: RootState) => state.transactions?.items || [];
const selectBudgets = (state: RootState) => state.budget?.items || [];
const selectAssets = (state: RootState) => state.portfolio?.assets || [];
const selectGoals = (state: RootState) => state.goals?.items || [];
const selectSubscriptions = (state: RootState) => state.subscriptions?.items || [];

/**
 * Dinamik finansal sağlık hesaplaması yapan reaktif selector.
 */
export const selectFinancialHealthData = createSelector(
  [selectTransactions, selectBudgets, selectAssets, selectGoals, selectSubscriptions],
  (transactions, budgets, assets, goals, subscriptions) => {
    // Adapter types conversion to prevent ts compliance mismatches
    const healthTxs = transactions.map((t) => ({
      amount: t.amount,
      transactionType: t.transactionType,
      date: t.date,
      category: t.category,
    }));

    const healthBudgets = budgets.map((b) => ({
      spentAmount: b.spentAmount,
      limitAmount: b.limitAmount,
      category: b.category,
    }));

    const healthAssets = assets.map((a) => ({
      type: a.type,
      amount: a.amount,
      avgCost: a.avgCost,
      currentPrice: a.currentPrice,
      currency: a.currency,
      name: a.name,
      symbol: a.symbol,
    }));

    const healthGoals = goals.map((g) => ({
      title: g.title,
      category: g.category,
      currentAmount: g.currentAmount,
      targetAmount: g.targetAmount,
    }));

    const healthSubs = subscriptions.map((s) => ({
      cost: s.cost,
      billingCycle: s.billingCycle,
    }));

    return (
      calculateFinancialHealth(healthTxs, healthBudgets, healthAssets, healthGoals, healthSubs) || {
        subscriptionLoad: 0,
        savingsRate: 0,
        incomeExpenseRatio: 0,
        emergencyFundProgress: 0,
        budgetUsage: 0,
        overallScore: 0,
      }
    );
  },
);
