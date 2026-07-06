import api from "@/services/api";
import ENDPOINTS from "@/services/api/endpoints";
import type { Transaction } from "../types/transactions.types";

export const TransactionsService = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>(ENDPOINTS.TRANSACTIONS.BASE);
    return response.data;
  },

  create: async (data: Omit<Transaction, "id" | "userId">): Promise<Transaction> => {
    const response = await api.post<Transaction>(ENDPOINTS.TRANSACTIONS.BASE, {
      ...data,
      userId: "1",
    });
    return response.data;
  },

  update: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.put<Transaction>(ENDPOINTS.TRANSACTIONS.DETAIL(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.TRANSACTIONS.DETAIL(id));
  },
};

export default TransactionsService;
