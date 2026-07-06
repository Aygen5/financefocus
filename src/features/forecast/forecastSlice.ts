import { createSlice } from "@reduxjs/toolkit";

export interface ForecastState {
  cashFlowPredictions: unknown[];
  expensePredictions: unknown[];
  savingsPredictions: unknown[];
  loading: boolean;
  error: string | null;
}

const initialState: ForecastState = {
  cashFlowPredictions: [],
  expensePredictions: [],
  savingsPredictions: [],
  loading: false,
  error: null,
};

export const forecastSlice = createSlice({
  name: "forecast",
  initialState,
  reducers: {
    clearForecast: (state) => {
      state.cashFlowPredictions = [];
      state.expensePredictions = [];
      state.savingsPredictions = [];
    },
  },
});

// Selectors
export const selectForecastCashFlow = (state: { forecast: ForecastState }) =>
  state.forecast.cashFlowPredictions;
export const selectForecastLoading = (state: { forecast: ForecastState }) => state.forecast.loading;
export const selectForecastError = (state: { forecast: ForecastState }) => state.forecast.error;

export const { clearForecast } = forecastSlice.actions;
export default forecastSlice.reducer;
