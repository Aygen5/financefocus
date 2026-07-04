/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  monthlyContribution: number;
}

interface GoalsState {
  items: FinancialGoal[];
  loading: boolean;
  error: string | null;
}

const initialState: GoalsState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchGoals = createAsyncThunk("goals/fetchGoals", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/goals");
    return response.data as FinancialGoal[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Hedefler yüklenemedi");
  }
});

export const addGoal = createAsyncThunk(
  "goals/addGoal",
  async (data: Omit<FinancialGoal, "id" | "userId">, { rejectWithValue }) => {
    try {
      const response = await api.post("/goals", {
        ...data,
        userId: "1",
      });
      return response.data as FinancialGoal;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Hedef eklenemedi");
    }
  },
);

export const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<FinancialGoal[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addGoal.fulfilled, (state, action: PayloadAction<FinancialGoal>) => {
        state.items.push(action.payload);
      });
  },
});

export default goalsSlice.reducer;
