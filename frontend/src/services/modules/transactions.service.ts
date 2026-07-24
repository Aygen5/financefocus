import api from "../api";
import ENDPOINTS from "../api/endpoints";
import type { Transaction } from "@/features/transactions/transactionsSlice";

export const TransactionsService = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get<Record<string, unknown>[]>(ENDPOINTS.TRANSACTIONS.BASE);
    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((item) => {
      const rawDate = (item.date || item.transactionDate || new Date().toISOString()) as string;
      const rawType = String(item.transactionType || "expense").toLowerCase();
      const isIncome = rawType === "income" || item.transactionType === 0;

      return {
        id: String(item.id || ""),
        userId: String(item.userId || ""),
        amount: typeof item.amount === "number" ? item.amount : Number(item.amount || 0),
        transactionType: isIncome ? "income" : "expense",
        category: String(item.category || "Genel"),
        paymentMethod: String(item.paymentMethod || ""),
        date: rawDate,
        status: "completed",
        description: String(item.description || ""),
        account: String(item.account || "Garanti BBVA"),
        currency: "TRY",
        createdAt: String(item.createdAt || rawDate),
        updatedAt: String(item.updatedAt || rawDate),
      };
    });
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
