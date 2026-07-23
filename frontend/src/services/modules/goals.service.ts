import goalApi from "@/api/goalApi";
import type { CreateGoalDto } from "@/api/goalApi";
import type { FinancialGoal } from "@/features/goals/goalsSlice";

export const GoalsService = {
  getAll: async (): Promise<FinancialGoal[]> => {
    const response = await goalApi.getAll();
    return (response.data || []).map((g) => ({
      id: g.id,
      userId: g.userId,
      title: g.name,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      targetDate: g.deadline,
      category: g.category,
    })) as unknown as FinancialGoal[];
  },

  create: async (data: Omit<FinancialGoal, "id" | "userId">): Promise<FinancialGoal> => {
    const dataObj = data as Record<string, unknown>;
    const payload: CreateGoalDto = {
      name:
        typeof dataObj.title === "string"
          ? dataObj.title
          : typeof dataObj.name === "string"
            ? dataObj.name
            : "Yeni Hedef",
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount || 0,
      deadline:
        typeof dataObj.targetDate === "string"
          ? dataObj.targetDate
          : typeof dataObj.deadline === "string"
            ? dataObj.deadline
            : new Date().toISOString(),
      category: data.category || "Genel",
    };
    const response = await goalApi.create(payload);
    return {
      id: response.data.id,
      userId: response.data.userId,
      title: response.data.name,
      targetAmount: response.data.targetAmount,
      currentAmount: response.data.currentAmount,
      targetDate: response.data.deadline,
      category: response.data.category,
    } as unknown as FinancialGoal;
  },

  update: async (id: string, data: Partial<FinancialGoal>): Promise<FinancialGoal> => {
    const dataObj = data as Record<string, unknown>;
    const payload: CreateGoalDto = {
      name:
        typeof dataObj.title === "string"
          ? dataObj.title
          : typeof dataObj.name === "string"
            ? dataObj.name
            : "Yeni Hedef",
      targetAmount: data.targetAmount || 0,
      currentAmount: data.currentAmount || 0,
      deadline:
        typeof dataObj.targetDate === "string"
          ? dataObj.targetDate
          : typeof dataObj.deadline === "string"
            ? dataObj.deadline
            : new Date().toISOString(),
      category: data.category || "Genel",
    };
    const response = await goalApi.update(id, payload);
    return {
      id: response.data.id,
      userId: response.data.userId,
      title: response.data.name,
      targetAmount: response.data.targetAmount,
      currentAmount: response.data.currentAmount,
      targetDate: response.data.deadline,
      category: response.data.category,
    } as unknown as FinancialGoal;
  },

  delete: async (id: string): Promise<void> => {
    await goalApi.delete(id);
  },
};

export default GoalsService;
