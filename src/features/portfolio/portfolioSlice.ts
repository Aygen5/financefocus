import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import PortfolioService from "@/services/modules/portfolio.service";

export interface AssetAllocation {
  id: string;
  userId: string;
  name: string;
  symbol: string;
  type: "stocks" | "gold" | "silver" | "crypto" | "fund" | "etf" | "cash";
  amount: number;
  avgCost: number;
  currentPrice: number;
  lastUpdated: string;
  sector: string;
  currency: string;
}

export interface PortfolioState {
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
      return (await PortfolioService.getAll()) as AssetAllocation[];
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Portföy yüklenemedi.");
    }
  },
);

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    clearPortfolio: (state) => {
      state.assets = [];
    },
  },
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
        state.error = (action.payload as string) || action.error.message || "Portföy yüklenemedi";
      });
  },
});

// Selectors
export const selectPortfolio = (state: { portfolio: PortfolioState }) => state.portfolio.assets;
export const selectPortfolioLoading = (state: { portfolio: PortfolioState }) =>
  state.portfolio.loading;
export const selectPortfolioError = (state: { portfolio: PortfolioState }) => state.portfolio.error;

export const { clearPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
