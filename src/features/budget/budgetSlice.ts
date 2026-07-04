/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limitAmount: number;
  spentAmount: number;
  period: string;
  description?: string;
}

interface BudgetState {
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
      const response = await api.get("/budgets");
      return response.data as Budget[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Bütçeler yüklenemedi");
    }
  },
);

export const addBudget = createAsyncThunk(
  "budget/addBudget",
  async (data: Omit<Budget, "id" | "userId" | "spentAmount">, { rejectWithValue }) => {
    try {
      const response = await api.post("/budgets", {
        ...data,
        spentAmount: 0,
        userId: "1",
      });
      return response.data as Budget;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Bütçe oluşturulamadı");
    }
  },
);

export const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {},
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
        state.error = action.payload as string;
      })
      .addCase(addBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        state.items.push(action.payload);
      });
  },
});

export default budgetSlice.reducer;
