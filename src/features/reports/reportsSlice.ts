/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface FinancialReport {
  id: string;
  name: string;
  date: string;
  type: string;
}

interface ReportsState {
  items: FinancialReport[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/reports");
      return response.data as FinancialReport[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Raporlar yüklenemedi");
    }
  },
);

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
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
        state.error = action.payload as string;
      });
  },
});

export default reportsSlice.reducer;
