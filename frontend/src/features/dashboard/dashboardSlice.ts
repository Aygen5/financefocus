import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import dashboardApi from "@/api/dashboardApi";
import type { DashboardDto } from "@/api/dashboardApi";

import { getActiveUserId, isCurrentSessionUser } from "@/utils/session";

export interface DashboardState {
  data: DashboardDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const requestingUserId = getActiveUserId();
      const response = await dashboardApi.getFullDashboard();
      if (response.success && response.data) {
        return { data: response.data, requestingUserId };
      }
      return rejectWithValue(response.message || "Dashboard verisi yüklenemedi.");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(
        errorObj.response?.data?.message || errorObj.message || "Dashboard verisi alınamadı.",
      );
    }
  },
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        const payloadObj = action.payload as
          { data?: DashboardDto; requestingUserId?: string } | DashboardDto;
        const requestingUserId =
          "requestingUserId" in payloadObj ? payloadObj.requestingUserId : undefined;
        const data =
          "data" in payloadObj && payloadObj.data ? payloadObj.data : (payloadObj as DashboardDto);

        if (!isCurrentSessionUser(requestingUserId)) {
          return;
        }
        state.data = data;
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Dashboard yüklenemedi.";
      });
  },
});

export const selectDashboardData = (state: { dashboard: DashboardState }) => state.dashboard.data;
export const selectDashboardLoading = (state: { dashboard: DashboardState }) =>
  state.dashboard.loading;
export const selectDashboardError = (state: { dashboard: DashboardState }) => state.dashboard.error;

export const { setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
