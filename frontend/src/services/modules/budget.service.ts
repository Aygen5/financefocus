import budgetApi from "@/api/budgetApi";
import type { CreateBudgetDto } from "@/api/budgetApi";
import type { Budget } from "@/features/budget/budgetSlice";

export const BudgetService = {
  getAll: async (): Promise<Budget[]> => {
    const response = await budgetApi.getAll();
    return (response.data || []).map((b) => ({
      id: b.id,
      userId: b.userId,
      category: b.category,
      limitAmount: b.limit,
      spentAmount: b.spentAmount,
      period: b.month,
    }));
  },

  create: async (data: Omit<Budget, "id" | "userId" | "spentAmount">): Promise<Budget> => {
    const payload: CreateBudgetDto = {
      category: data.category,
      limit: data.limitAmount,
      month: data.period || new Date().toISOString().substring(0, 7),
    };
    const response = await budgetApi.create(payload);
    return {
      id: response.data.id,
      userId: response.data.userId,
      category: response.data.category,
      limitAmount: response.data.limit,
      spentAmount: response.data.spentAmount,
      period: response.data.month,
    };
  },

  update: async (id: string, data: Partial<Budget>): Promise<Budget> => {
    const payload: CreateBudgetDto = {
      category: data.category || "Genel",
      limit: data.limitAmount || 0,
      month: data.period || new Date().toISOString().substring(0, 7),
    };
    const response = await budgetApi.update(id, payload);
    return {
      id: response.data.id,
      userId: response.data.userId,
      category: response.data.category,
      limitAmount: response.data.limit,
      spentAmount: response.data.spentAmount,
      period: response.data.month,
    };
  },

  delete: async (id: string): Promise<void> => {
    await budgetApi.delete(id);
  },
};

export default BudgetService;
