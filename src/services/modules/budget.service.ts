import api from "../api";
import ENDPOINTS from "../api/endpoints";
import type { Budget } from "@/features/budget/budgetSlice";

export const BudgetService = {
  getAll: async (): Promise<Budget[]> => {
    const response = await api.get<Budget[]>(ENDPOINTS.BUDGETS.BASE);
    return response.data;
  },

  create: async (data: Omit<Budget, "id" | "userId" | "spentAmount">): Promise<Budget> => {
    const response = await api.post<Budget>(ENDPOINTS.BUDGETS.BASE, {
      ...data,
      spentAmount: 0,
      userId: "1",
    });
    return response.data;
  },

  update: async (id: string, data: Partial<Budget>): Promise<Budget> => {
    const response = await api.patch<Budget>(ENDPOINTS.BUDGETS.DETAIL(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.BUDGETS.DETAIL(id));
  },
};

export default BudgetService;
