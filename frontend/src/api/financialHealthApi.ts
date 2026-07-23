import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";
import type { FinancialInsightDto } from "./dashboardApi";

export interface ScoreBreakdownDto {
  totalScore: number;
  incomeExpenseScore: number;
  savingsRateScore: number;
  budgetAdherenceScore: number;
  goalProgressScore: number;
  subscriptionOverheadScore: number;
  portfolioSizeScore: number;
  portfolioProfitabilityScore: number;
}

export interface FinancialHealthSummaryDto {
  financialHealthScore: number;
  riskLevel: string;
  topInsights: FinancialInsightDto[];
}

export interface FinancialHealthDto {
  financialHealthScore: number;
  riskLevel: string;
  scoreBreakdown: ScoreBreakdownDto;
  insights: FinancialInsightDto[];
  calculationDate: string;
}

export const financialHealthApi = {
  getFullHealth: async (): Promise<ApiResponse<FinancialHealthDto>> => {
    const res = await axiosClient.get<ApiResponse<FinancialHealthDto>>("/financial-health");
    return res.data;
  },

  getSummary: async (): Promise<ApiResponse<FinancialHealthSummaryDto>> => {
    const res = await axiosClient.get<ApiResponse<FinancialHealthSummaryDto>>(
      "/financial-health/summary",
    );
    return res.data;
  },

  getInsights: async (): Promise<ApiResponse<FinancialInsightDto[]>> => {
    const res = await axiosClient.get<ApiResponse<FinancialInsightDto[]>>(
      "/financial-health/insights",
    );
    return res.data;
  },

  getScoreBreakdown: async (): Promise<ApiResponse<ScoreBreakdownDto>> => {
    const res = await axiosClient.get<ApiResponse<ScoreBreakdownDto>>("/financial-health/score");
    return res.data;
  },
};

export default financialHealthApi;
