import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";
import type { SubscriptionDto } from "./subscriptionApi";

export interface CashFlowForecastDto {
  estimatedMonthlyIncome: number;
  estimatedMonthlyExpense: number;
  estimatedMonthlySavings: number;
  algorithmUsed: string;
}

export interface BudgetForecastDto {
  category: string;
  budgetLimit: number;
  currentSpentAmount: number;
  dailySpendingRate: number;
  projectedMonthEndExpense: number;
  estimatedDepletionDate?: string;
  exceedProbabilityPercentage: number;
  riskLevel: string;
}

export interface GoalForecastDto {
  goalId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  monthlySavingsContribution: number;
  estimatedCompletionDate?: string;
  estimatedMonthsRemaining: number;
  recommendation: string;
}

export interface PortfolioForecastDto {
  currentTotalInvestment: number;
  currentTotalValue: number;
  averageReturnRatePercentage: number;
  expectedPortfolioValueIn6Months: number;
  expectedPortfolioValueIn12Months: number;
  expectedProfitLossIn12Months: number;
}

export interface SubscriptionForecastDto {
  activeSubscriptionCount: number;
  next30DaysTotalCost: number;
  next90DaysTotalCost: number;
  upcomingRenewalsIn30Days: SubscriptionDto[];
}

export interface ForecastSummaryDto {
  estimatedMonthlyIncome: number;
  estimatedMonthlyExpense: number;
  estimatedSavings: number;
  budgetRiskLevel: string;
  estimatedGoalCompletionDate?: string;
  estimatedPortfolioValue: number;
}

export interface ForecastDto {
  cashFlow: CashFlowForecastDto;
  budgets: BudgetForecastDto[];
  goals: GoalForecastDto[];
  portfolio: PortfolioForecastDto;
  subscriptions: SubscriptionForecastDto;
  summary: ForecastSummaryDto;
  generatedAt: string;
}

export const forecastApi = {
  getFullForecast: async (): Promise<ApiResponse<ForecastDto>> => {
    const res = await axiosClient.get<ApiResponse<ForecastDto>>("/forecast");
    return res.data;
  },

  getSummary: async (): Promise<ApiResponse<ForecastSummaryDto>> => {
    const res = await axiosClient.get<ApiResponse<ForecastSummaryDto>>("/forecast/summary");
    return res.data;
  },

  getCashFlow: async (): Promise<ApiResponse<CashFlowForecastDto>> => {
    const res = await axiosClient.get<ApiResponse<CashFlowForecastDto>>("/forecast/cashflow");
    return res.data;
  },

  getBudgets: async (): Promise<ApiResponse<BudgetForecastDto[]>> => {
    const res = await axiosClient.get<ApiResponse<BudgetForecastDto[]>>("/forecast/budgets");
    return res.data;
  },

  getGoals: async (): Promise<ApiResponse<GoalForecastDto[]>> => {
    const res = await axiosClient.get<ApiResponse<GoalForecastDto[]>>("/forecast/goals");
    return res.data;
  },

  getPortfolio: async (): Promise<ApiResponse<PortfolioForecastDto>> => {
    const res = await axiosClient.get<ApiResponse<PortfolioForecastDto>>("/forecast/portfolio");
    return res.data;
  },

  getSubscriptions: async (): Promise<ApiResponse<SubscriptionForecastDto>> => {
    const res =
      await axiosClient.get<ApiResponse<SubscriptionForecastDto>>("/forecast/subscriptions");
    return res.data;
  },
};

export default forecastApi;
