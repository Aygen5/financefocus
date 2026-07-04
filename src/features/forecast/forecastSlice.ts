import { createSlice } from "@reduxjs/toolkit";

interface ForecastState {
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
  reducers: {},
});

export default forecastSlice.reducer;
