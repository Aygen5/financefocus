import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import activityApi from "@/api/activityApi";

export interface ActivityLog {
  id: string;
  action: string;
  category: string;
  description: string;
  user: string;
  date: string;
  time: string;
  icon: string;
  status: "success" | "warning" | "info" | "error";
  timestamp: string;
  activityType?: string;
  title?: string;
}

export interface ActivityState {
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
      const response = await activityApi.getAll();
      if (response.success && Array.isArray(response.data)) {
        return response.data.map((item) => ({
          id: item.id,
          action: item.action || item.title || "Aktivite",
          category: item.category || "General",
          description: item.description || "",
          user: "Kullanıcı",
          date: item.createdAt
            ? item.createdAt.split("T")[0]
            : new Date().toISOString().split("T")[0],
          time: item.createdAt ? item.createdAt.split("T")[1]?.substring(0, 8) || "" : "",
          icon: "Activity",
          status: (item.status as "success" | "warning" | "info" | "error") || "info",
          timestamp: item.createdAt || new Date().toISOString(),
          activityType: item.activityType,
          title: item.title,
        }));
      }
      return [];
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Aktiviteler yüklenemedi.");
    }
  },
);

export const addActivityLog = createAsyncThunk(
  "activity/addActivityLog",
  async (newLog: Omit<ActivityLog, "id" | "date" | "time" | "timestamp">) => {
    const timestamp = new Date().toISOString();
    const date = timestamp.split("T")[0];
    const time = timestamp.split("T")[1].substring(0, 8);
    const id = `act-${Math.random().toString(36).substr(2, 9)}`;

    return {
      ...newLog,
      id,
      date,
      time,
      timestamp,
    };
  },
);

export const activitySlice = createSlice({
  name: "activityLog",
  initialState,
  reducers: {
    clearActivities: (state) => {
      state.logs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action: PayloadAction<ActivityLog[]>) => {
        state.loading = false;
        state.logs = action.payload.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        state.error = null;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Aktiviteler yüklenemedi.";
      })
      .addCase(addActivityLog.fulfilled, (state, action: PayloadAction<ActivityLog>) => {
        state.logs.unshift(action.payload);
      });
  },
});

export const { clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
