import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import BudgetService from "@/services/modules/budget.service";

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limitAmount: number;
  spentAmount: number;
  period: string;
  description?: string;
}

export interface BudgetState {
  items: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchBudgets = createAsyncThunk(
  "budget/fetchBudgets",
  async (_, { rejectWithValue }) => {
    try {
      return await BudgetService.getAll();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Bütçeler yüklenemedi.");
    }
  },
);

export const addBudget = createAsyncThunk(
  "budget/addBudget",
  async (data: Omit<Budget, "id" | "userId" | "spentAmount">, { rejectWithValue }) => {
    try {
      return await BudgetService.create(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Bütçe eklenemedi.");
    }
  },
);

export const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    clearBudgets: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action: PayloadAction<Budget[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "Bütçeler yüklenemedi";
      })
      .addCase(addBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        state.items.push(action.payload);
      });
  },
});

// Selectors
export const selectBudgets = (state: { budget: BudgetState }) => state.budget.items;
export const selectBudgetLoading = (state: { budget: BudgetState }) => state.budget.loading;
export const selectBudgetError = (state: { budget: BudgetState }) => state.budget.error;

export const { clearBudgets } = budgetSlice.actions;
export default budgetSlice.reducer;
