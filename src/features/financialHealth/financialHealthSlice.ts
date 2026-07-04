/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface HealthFactors {
  incomeExpenseRatio: number;
  savingsRate: number;
  budgetAdherence: number;
  debtToIncomeRatio: number;
}

interface FinancialHealthState {
  score: number;
  factors: HealthFactors;
  loading: boolean;
  error: string | null;
}

const initialState: FinancialHealthState = {
  score: 0,
  factors: {
    incomeExpenseRatio: 0,
    savingsRate: 0,
    budgetAdherence: 0,
    debtToIncomeRatio: 0,
  },
  loading: false,
  error: null,
};

export const fetchFinancialHealth = createAsyncThunk(
  "financialHealth/fetchFinancialHealth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/financial-health");
      return response.data as { score: number; factors: HealthFactors };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Finansal sağlık durumu yüklenemedi");
    }
  },
);

export const financialHealthSlice = createSlice({
  name: "financialHealth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialHealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFinancialHealth.fulfilled,
        (state, action: PayloadAction<{ score: number; factors: HealthFactors }>) => {
          state.loading = false;
          state.score = action.payload.score;
          state.factors = action.payload.factors;
          state.error = null;
        },
      )
      .addCase(fetchFinancialHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default financialHealthSlice.reducer;
