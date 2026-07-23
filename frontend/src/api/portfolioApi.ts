import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";

export interface PortfolioAssetDto {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  purchasePrice: number;
  currentPrice: number;
  assetType: number;
  totalInvestment: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  userId: string;
}

export interface PortfolioSummaryDto {
  totalInvestment: number;
  totalCurrentValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  assetCount: number;
  assets: PortfolioAssetDto[];
}

export interface CreatePortfolioAssetDto {
  name: string;
  symbol: string;
  amount: number;
  purchasePrice: number;
  currentPrice: number;
  assetType: number;
}

export type UpdatePortfolioAssetDto = CreatePortfolioAssetDto;

export const portfolioApi = {
  getAll: async (): Promise<ApiResponse<PortfolioAssetDto[]>> => {
    const res = await axiosClient.get<ApiResponse<PortfolioAssetDto[]>>("/portfolio");
    return res.data;
  },

  getSummary: async (): Promise<ApiResponse<PortfolioSummaryDto>> => {
    const res = await axiosClient.get<ApiResponse<PortfolioSummaryDto>>("/portfolio/summary");
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<PortfolioAssetDto>> => {
    const res = await axiosClient.get<ApiResponse<PortfolioAssetDto>>(`/portfolio/${id}`);
    return res.data;
  },

  create: async (data: CreatePortfolioAssetDto): Promise<ApiResponse<PortfolioAssetDto>> => {
    const res = await axiosClient.post<ApiResponse<PortfolioAssetDto>>("/portfolio", data);
    return res.data;
  },

  update: async (
    id: string,
    data: UpdatePortfolioAssetDto,
  ): Promise<ApiResponse<PortfolioAssetDto>> => {
    const res = await axiosClient.put<ApiResponse<PortfolioAssetDto>>(`/portfolio/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosClient.delete<ApiResponse<boolean>>(`/portfolio/${id}`);
    return res.data;
  },
};

export default portfolioApi;
