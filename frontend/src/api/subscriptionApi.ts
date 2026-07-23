import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";

export interface SubscriptionDto {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
  isActive: boolean;
  monthlyEquivalentPrice: number;
  userId: string;
}

export interface SubscriptionSummaryDto {
  totalMonthlyCost: number;
  activeSubscriptionCount: number;
  inactiveSubscriptionCount: number;
  upcomingRenewalsCount: number;
  upcomingRenewals: SubscriptionDto[];
  subscriptions: SubscriptionDto[];
}

export interface CreateSubscriptionDto {
  name: string;
  price: number;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
  isActive: boolean;
}

export type UpdateSubscriptionDto = CreateSubscriptionDto;

export const subscriptionApi = {
  getAll: async (): Promise<ApiResponse<SubscriptionDto[]>> => {
    const res = await axiosClient.get<ApiResponse<SubscriptionDto[]>>("/subscriptions");
    return res.data;
  },

  getSummary: async (): Promise<ApiResponse<SubscriptionSummaryDto>> => {
    const res =
      await axiosClient.get<ApiResponse<SubscriptionSummaryDto>>("/subscriptions/summary");
    return res.data;
  },

  getUpcoming: async (): Promise<ApiResponse<SubscriptionDto[]>> => {
    const res = await axiosClient.get<ApiResponse<SubscriptionDto[]>>("/subscriptions/upcoming");
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<SubscriptionDto>> => {
    const res = await axiosClient.get<ApiResponse<SubscriptionDto>>(`/subscriptions/${id}`);
    return res.data;
  },

  create: async (data: CreateSubscriptionDto): Promise<ApiResponse<SubscriptionDto>> => {
    const res = await axiosClient.post<ApiResponse<SubscriptionDto>>("/subscriptions", data);
    return res.data;
  },

  update: async (
    id: string,
    data: UpdateSubscriptionDto,
  ): Promise<ApiResponse<SubscriptionDto>> => {
    const res = await axiosClient.put<ApiResponse<SubscriptionDto>>(`/subscriptions/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosClient.delete<ApiResponse<boolean>>(`/subscriptions/${id}`);
    return res.data;
  },
};

export default subscriptionApi;
