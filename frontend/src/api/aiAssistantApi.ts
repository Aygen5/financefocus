import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";

export interface AIAdviceDto {
  title: string;
  message: string;
  category: string;
  priority: string;
  type: string;
}

export interface AIConversationSummaryDto {
  summaryText: string;
  financialHealthScore: number;
  riskLevel: string;
  topRecommendation: string;
  generatedAt: string;
}

export interface AIAssistantDto {
  summary: AIConversationSummaryDto;
  advices: AIAdviceDto[];
  riskAnalysis: AIAdviceDto[];
  opportunities: AIAdviceDto[];
  providerUsed: string;
  generatedAt: string;
}

export interface AIChatResponseDto {
  answer: string;
  category: string;
  providerUsed: string;
  respondedAt: string;
}

export const aiAssistantApi = {
  getFullAnalysis: async (): Promise<ApiResponse<AIAssistantDto>> => {
    const res = await axiosClient.get<ApiResponse<AIAssistantDto>>("/aiassistant");
    return res.data;
  },

  chat: async (prompt: string): Promise<ApiResponse<AIChatResponseDto>> => {
    const res = await axiosClient.post<ApiResponse<AIChatResponseDto>>("/aiassistant/chat", {
      prompt,
    });
    return res.data;
  },

  getAdvice: async (): Promise<ApiResponse<AIAdviceDto[]>> => {
    const res = await axiosClient.get<ApiResponse<AIAdviceDto[]>>("/aiassistant/advice");
    return res.data;
  },

  getSummary: async (): Promise<ApiResponse<AIConversationSummaryDto>> => {
    const res =
      await axiosClient.get<ApiResponse<AIConversationSummaryDto>>("/aiassistant/summary");
    return res.data;
  },

  getRiskAnalysis: async (): Promise<ApiResponse<AIAdviceDto[]>> => {
    const res = await axiosClient.get<ApiResponse<AIAdviceDto[]>>("/aiassistant/risk-analysis");
    return res.data;
  },

  getOpportunities: async (): Promise<ApiResponse<AIAdviceDto[]>> => {
    const res = await axiosClient.get<ApiResponse<AIAdviceDto[]>>("/aiassistant/opportunities");
    return res.data;
  },
};

export default aiAssistantApi;
