import { describe, it, expect } from "vitest";
import budgetReducer, { clearBudgets, BudgetState } from "@/features/budget/budgetSlice";

describe("budgetSlice reducer", () => {
  const initialState: BudgetState = {
    items: [
      { id: "b1", category: "Market", limit: 10000, spent: 4000, isDemo: true },
      { id: "b2", category: "Kira", limit: 30000, spent: 30000, isDemo: false },
    ],
    loading: false,
    error: null,
  };

  it("should clear all budget items", () => {
    const nextState = budgetReducer(initialState, clearBudgets());
    expect(nextState.items).toHaveLength(0);
    expect(nextState.error).toBeNull();
  });
});
