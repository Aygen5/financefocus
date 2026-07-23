import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";

export interface TransactionDto {
  id: string;
  description: string;
  amount: number;
  transactionDate: string;
  category: string;
  transactionType: number;
  paymentMethod: string;
  account: string;
  userId: string;
}

export interface CreateTransactionDto {
  description: string;
  amount: number;
  transactionDate: string;
  category: string;
  transactionType: number;
  paymentMethod: string;
  account: string;
}

export type UpdateTransactionDto = CreateTransactionDto;

export const transactionApi = {
  getAll: async (): Promise<ApiResponse<TransactionDto[]>> => {
    const res = await axiosClient.get<ApiResponse<TransactionDto[]>>("/transactions");
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<TransactionDto>> => {
    const res = await axiosClient.get<ApiResponse<TransactionDto>>(`/transactions/${id}`);
    return res.data;
  },

  create: async (data: CreateTransactionDto): Promise<ApiResponse<TransactionDto>> => {
    const res = await axiosClient.post<ApiResponse<TransactionDto>>("/transactions", data);
    return res.data;
  },

  update: async (id: string, data: UpdateTransactionDto): Promise<ApiResponse<TransactionDto>> => {
    const res = await axiosClient.put<ApiResponse<TransactionDto>>(`/transactions/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosClient.delete<ApiResponse<boolean>>(`/transactions/${id}`);
    return res.data;
  },
};

export default transactionApi;
