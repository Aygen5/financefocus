import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface HealthFactors {
  incomeExpenseRatio: number;
  savingsRate: number;
  budgetAdherence: number;
  debtToIncomeRatio: number;
}

export interface FinancialHealthState {
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

// Dummy Thunks for compilation safety
export const fetchFinancialHealth = createAsyncThunk(
  "financialHealth/fetchFinancialHealth",
  async () => {
    return {
      score: 0,
      factors: {
        incomeExpenseRatio: 0,
        savingsRate: 0,
        budgetAdherence: 0,
        debtToIncomeRatio: 0,
      },
    };
  },
);

export const financialHealthSlice = createSlice({
  name: "financeHealth",
  initialState,
  reducers: {
    resetHealth: (state) => {
      state.score = 0;
      state.factors = initialState.factors;
    },
  },
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
        state.error = action.error.message || "Yüklenemedi";
      });
  },
});

// Selectors
export const selectFinancialHealthScore = (state: { financialHealth: FinancialHealthState }) =>
  state.financialHealth.score;
export const selectFinancialHealthFactors = (state: { financialHealth: FinancialHealthState }) =>
  state.financialHealth.factors;
export const selectFinancialHealthLoading = (state: { financialHealth: FinancialHealthState }) =>
  state.financialHealth.loading;
export const selectFinancialHealthError = (state: { financialHealth: FinancialHealthState }) =>
  state.financialHealth.error;

export const { resetHealth } = financialHealthSlice.actions;
export default financialHealthSlice.reducer;
