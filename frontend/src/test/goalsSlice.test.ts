import { describe, it, expect } from "vitest";
import goalsReducer, { clearGoals, GoalsState } from "@/features/goals/goalsSlice";

describe("goalsSlice reducer", () => {
  const initialState: GoalsState = {
    items: [
      {
        id: "g1",
        name: "Ev Fonu",
        targetAmount: 500000,
        currentAmount: 200000,
        category: "Yatırım",
        deadline: "2027-12-31",
        isDemo: true,
      },
    ],
    loading: false,
    error: null,
  };

  it("should clear all goal items", () => {
    const nextState = goalsReducer(initialState, clearGoals());
    expect(nextState.items).toHaveLength(0);
  });
});
