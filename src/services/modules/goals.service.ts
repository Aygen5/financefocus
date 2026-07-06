import api from "../api";
import ENDPOINTS from "../api/endpoints";
import type { FinancialGoal } from "@/features/goals/goalsSlice";

export const GoalsService = {
  getAll: async (): Promise<FinancialGoal[]> => {
    const response = await api.get<FinancialGoal[]>(ENDPOINTS.GOALS.BASE);
    return response.data;
  },

  create: async (data: Omit<FinancialGoal, "id" | "userId">): Promise<FinancialGoal> => {
    const response = await api.post<FinancialGoal>(ENDPOINTS.GOALS.BASE, {
      ...data,
      userId: "1",
    });
    return response.data;
  },

  update: async (id: string, data: Partial<FinancialGoal>): Promise<FinancialGoal> => {
    const response = await api.patch<FinancialGoal>(ENDPOINTS.GOALS.DETAIL(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.GOALS.DETAIL(id));
  },
};

export default GoalsService;
