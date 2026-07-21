import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface FinancialReport {
  id: string;
  name: string;
  date: string;
  type: string;
}

export interface ReportsState {
  items: FinancialReport[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchReports = createAsyncThunk("reports/fetchReports", async () => {
  return [] as FinancialReport[];
});

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReports: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action: PayloadAction<FinancialReport[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Raporlar yüklenemedi";
      });
  },
});

export const selectReports = (state: { reports: ReportsState }) => state.reports.items;
export const selectReportsLoading = (state: { reports: ReportsState }) => state.reports.loading;
export const selectReportsError = (state: { reports: ReportsState }) => state.reports.error;

export const { clearReports } = reportsSlice.actions;
export default reportsSlice.reducer;
