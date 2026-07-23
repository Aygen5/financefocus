import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";

export interface BudgetDto {
  id: string;
  category: string;
  limit: number;
  spentAmount: number;
  month: string;
  userId: string;
}

export interface CreateBudgetDto {
  category: string;
  limit: number;
  month: string;
}

export type UpdateBudgetDto = CreateBudgetDto;

export const budgetApi = {
  getAll: async (): Promise<ApiResponse<BudgetDto[]>> => {
    const res = await axiosClient.get<ApiResponse<BudgetDto[]>>("/budgets");
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<BudgetDto>> => {
    const res = await axiosClient.get<ApiResponse<BudgetDto>>(`/budgets/${id}`);
    return res.data;
  },

  create: async (data: CreateBudgetDto): Promise<ApiResponse<BudgetDto>> => {
    const res = await axiosClient.post<ApiResponse<BudgetDto>>("/budgets", data);
    return res.data;
  },

  update: async (id: string, data: UpdateBudgetDto): Promise<ApiResponse<BudgetDto>> => {
    const res = await axiosClient.put<ApiResponse<BudgetDto>>(`/budgets/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosClient.delete<ApiResponse<boolean>>(`/budgets/${id}`);
    return res.data;
  },
};

export default budgetApi;
