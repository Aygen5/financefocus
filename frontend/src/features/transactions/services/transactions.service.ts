import transactionApi from "@/api/transactionApi";
import type { CreateTransactionDto } from "@/api/transactionApi";
import type { Transaction } from "../types/transactions.types";

export const TransactionsService = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await transactionApi.getAll();
    return (response.data || []).map((t) => ({
      ...t,
      date: t.transactionDate,
      type: t.transactionType === 0 ? "income" : "expense",
      status: "completed",
    })) as unknown as Transaction[];
  },

  create: async (data: Omit<Transaction, "id" | "userId">): Promise<Transaction> => {
    const dataObj = data as Record<string, unknown>;
    const payload: CreateTransactionDto = {
      description: data.description,
      amount: data.amount,
      transactionDate: typeof dataObj.date === "string" ? dataObj.date : new Date().toISOString(),
      category: data.category,
      transactionType: dataObj.type === "income" ? 0 : 1,
      paymentMethod:
        typeof dataObj.paymentMethod === "string" ? dataObj.paymentMethod : "Kredi Kartı",
      account: typeof dataObj.account === "string" ? dataObj.account : "Ana Hesap",
    };
    const response = await transactionApi.create(payload);
    return {
      ...response.data,
      date: response.data.transactionDate,
      type: response.data.transactionType === 0 ? "income" : "expense",
      status: "completed",
    } as unknown as Transaction;
  },

  update: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
    const dataObj = data as Record<string, unknown>;
    const payload: CreateTransactionDto = {
      description: data.description || "",
      amount: data.amount || 0,
      transactionDate: typeof dataObj.date === "string" ? dataObj.date : new Date().toISOString(),
      category: data.category || "Genel",
      transactionType: dataObj.type === "income" ? 0 : 1,
      paymentMethod:
        typeof dataObj.paymentMethod === "string" ? dataObj.paymentMethod : "Kredi Kartı",
      account: typeof dataObj.account === "string" ? dataObj.account : "Ana Hesap",
    };
    const response = await transactionApi.update(id, payload);
    return {
      ...response.data,
      date: response.data.transactionDate,
      type: response.data.transactionType === 0 ? "income" : "expense",
      status: "completed",
    } as unknown as Transaction;
  },

  delete: async (id: string): Promise<void> => {
    await transactionApi.delete(id);
  },
};

export default TransactionsService;
