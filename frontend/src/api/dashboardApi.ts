import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";
import type { TransactionDto } from "./transactionApi";
import type { BudgetDto } from "./budgetApi";
import type { GoalDto } from "./goalApi";
import type { PortfolioSummaryDto } from "./portfolioApi";
import type { SubscriptionSummaryDto } from "./subscriptionApi";
import type { NotificationDto } from "./notificationApi";
import type { ActivityLogDto } from "./activityApi";

export interface FinancialInsightDto {
  title: string;
  message: string;
  type: string;
  category: string;
}

export interface DashboardSummaryDto {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  netSavings: number;
  savingsRate: number;
  financialHealthScore: number;
  riskLevel: string;
  topInsights: FinancialInsightDto[];
  estimatedMonthlyIncome: number;
  estimatedMonthlyExpense: number;
  estimatedSavings: number;
  budgetRiskLevel: string;
  estimatedGoalCompletionDate?: string;
  estimatedPortfolioValue: number;
  activeGoalCount: number;
  completedGoalCount: number;
  averageGoalProgressPercentage: number;
  portfolioTotalInvestment: number;
  portfolioCurrentValue: number;
  portfolioTotalProfitLoss: number;
  portfolioTotalProfitLossPercentage: number;
  activeSubscriptionCount: number;
  monthlyTotalSubscriptionCost: number;
  upcomingPaymentsCount: number;
  unreadNotificationCount: number;
  totalActivityCount: number;
}

export interface DashboardDto {
  summary: DashboardSummaryDto;
  recentTransactions: TransactionDto[];
  budgets: BudgetDto[];
  goals: GoalDto[];
  portfolio: PortfolioSummaryDto;
  subscriptions: SubscriptionSummaryDto;
  recentNotifications: NotificationDto[];
  recentActivities: ActivityLogDto[];
}

export const dashboardApi = {
  getFullDashboard: async (): Promise<ApiResponse<DashboardDto>> => {
    const res = await axiosClient.get<ApiResponse<DashboardDto>>("/dashboard");
    return res.data;
  },

  getSummary: async (): Promise<ApiResponse<DashboardSummaryDto>> => {
    const res = await axiosClient.get<ApiResponse<DashboardSummaryDto>>("/dashboard/summary");
    return res.data;
  },
};

export default dashboardApi;
