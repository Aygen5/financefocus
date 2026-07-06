import api from "../api";
import ENDPOINTS from "../api/endpoints";
import type { Transaction } from "@/features/transactions/transactionsSlice";

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

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.TRANSACTIONS.DETAIL(id));
  },
};

export default TransactionsService;
