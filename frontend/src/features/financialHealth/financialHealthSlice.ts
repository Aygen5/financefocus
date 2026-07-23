import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import financialHealthApi from "@/api/financialHealthApi";
import type { FinancialHealthDto } from "@/api/financialHealthApi";

export interface FinancialHealthState {
  healthData: FinancialHealthDto | null;
  score: number;
  riskLevel: string;
  loading: boolean;
  error: string | null;
}

const initialState: FinancialHealthState = {
  healthData: null,
  score: 0,
  riskLevel: "Moderate",
  loading: false,
  error: null,
};

export const fetchFinancialHealth = createAsyncThunk(
  "financialHealth/fetchFinancialHealth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await financialHealthApi.getFullHealth();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || "Finansal sağlık verisi alınamadı.");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(
        errorObj.response?.data?.message || errorObj.message || "Finansal sağlık yüklenemedi.",
      );
    }
  },
);

export const financialHealthSlice = createSlice({
  name: "financialHealth",
  initialState,
  reducers: {
    resetHealth: (state) => {
      state.healthData = null;
      state.score = 0;
      state.riskLevel = "Moderate";
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
        (state, action: PayloadAction<FinancialHealthDto>) => {
          state.loading = false;
          state.healthData = action.payload;
          state.score = action.payload.financialHealthScore;
          state.riskLevel = action.payload.riskLevel;
          state.error = null;
        },
      )
      .addCase(fetchFinancialHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Yüklenemedi";
      });
  },
});

export const selectFinancialHealthData = (state: { financialHealth: FinancialHealthState }) =>
  state.financialHealth.healthData;
export const selectFinancialHealthScore = (state: { financialHealth: FinancialHealthState }) =>
  state.financialHealth.score;
export const selectFinancialHealthRiskLevel = (state: { financialHealth: FinancialHealthState }) =>
  state.financialHealth.riskLevel;
export const selectFinancialHealthLoading = (state: { financialHealth: FinancialHealthState }) =>
  state.financialHealth.loading;
export const selectFinancialHealthError = (state: { financialHealth: FinancialHealthState }) =>
  state.financialHealth.error;

export const { resetHealth } = financialHealthSlice.actions;
export default financialHealthSlice.reducer;
