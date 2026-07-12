import { createSlice } from "@reduxjs/toolkit";

export interface DashboardState {
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  loading: false,
  error: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const selectDashboardLoading = (state: { dashboard: DashboardState }) =>
  state.dashboard.loading;
export const selectDashboardError = (state: { dashboard: DashboardState }) => state.dashboard.error;

export const { setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
