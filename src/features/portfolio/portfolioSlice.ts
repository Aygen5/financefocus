/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface AssetAllocation {
  type: "cash" | "gold" | "usd" | "eur" | "stocks";
  amount: number;
  valueInBaseCurrency: number;
}

interface PortfolioState {
  assets: AssetAllocation[];
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  assets: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetchPortfolio",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/portfolio");
      return response.data as AssetAllocation[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Portföy yüklenemedi");
    }
  },
);

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action: PayloadAction<AssetAllocation[]>) => {
        state.loading = false;
        state.assets = action.payload;
        state.error = null;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default portfolioSlice.reducer;
