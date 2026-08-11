import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import forecastApi from "@/api/forecastApi";
import type { ForecastDto } from "@/api/forecastApi";

import { getActiveUserId, isCurrentSessionUser } from "@/utils/session";

export interface ForecastState {
  data: ForecastDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: ForecastState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchForecastData = createAsyncThunk(
  "forecast/fetchForecastData",
  async (_, { rejectWithValue }) => {
    try {
      const requestingUserId = getActiveUserId();
      const response = await forecastApi.getFullForecast();
      if (response.success && response.data) {
        return { data: response.data, requestingUserId };
      }
      return rejectWithValue(response.message || "Tahmin verisi yüklenemedi.");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(
        errorObj.response?.data?.message || errorObj.message || "Tahmin motoru verisi alınamadı.",
      );
    }
  },
);

export const forecastSlice = createSlice({
  name: "forecast",
  initialState,
  reducers: {
    clearForecast: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForecastData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecastData.fulfilled, (state, action) => {
        state.loading = false;
        const payloadObj = action.payload as
          { data?: ForecastDto; requestingUserId?: string } | ForecastDto;
        const requestingUserId =
          "requestingUserId" in payloadObj ? payloadObj.requestingUserId : undefined;
        const data =
          "data" in payloadObj && payloadObj.data ? payloadObj.data : (payloadObj as ForecastDto);

        if (!isCurrentSessionUser(requestingUserId)) {
          return;
        }
        state.data = data;
        state.error = null;
      })
      .addCase(fetchForecastData.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Tahminler yüklenemedi.";
      });
  },
});

export const selectForecastData = (state: { forecast: ForecastState }) => state.forecast.data;
export const selectForecastLoading = (state: { forecast: ForecastState }) => state.forecast.loading;
export const selectForecastError = (state: { forecast: ForecastState }) => state.forecast.error;

export const { clearForecast } = forecastSlice.actions;
export default forecastSlice.reducer;
