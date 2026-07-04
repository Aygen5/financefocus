/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  timeLabel?: string;
  category?: string;
  meta?: {
    idLabel?: string;
    userName?: string;
    progress?: number;
    amount?: number;
  };
}

interface ActivityState {
  logs: ActivityLog[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  logs: [],
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk(
  "activity/fetchActivities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/activities");
      return response.data as ActivityLog[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Aktiviteler yüklenemedi");
    }
  },
);

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action: PayloadAction<ActivityLog[]>) => {
        state.loading = false;
        state.logs = action.payload;
        state.error = null;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default activitySlice.reducer;
