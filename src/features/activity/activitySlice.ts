import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

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

// Mock logs list for initial seeding if mock server fails or returns empty
const MOCK_INITIAL_LOGS: ActivityLog[] = [
  {
    id: "act-1",
    action: "Login",
    category: "Auth",
    description: "Kullanıcı sisteme başarıyla giriş yaptı.",
    user: "Aygen",
    date: "2026-07-05",
    time: "16:00:00",
    icon: "LogIn",
    status: "success",
    timestamp: "2026-07-05T16:00:00Z",
  },
  {
    id: "act-2",
    action: "Transaction Added",
    category: "Transactions",
    description: "Kira ödemesi (Gider) kaydı eklendi.",
    user: "Aygen",
    date: "2026-07-05",
    time: "14:20:00",
    icon: "PlusCircle",
    status: "success",
    timestamp: "2026-07-05T14:20:00Z",
  },
  {
    id: "act-3",
    action: "Budget Updated",
    category: "Budget",
    description: "Gıda bütçe limiti 4500 TRY olarak güncellendi.",
    user: "Aygen",
    date: "2026-07-05",
    time: "11:15:00",
    icon: "Sliders",
    status: "info",
    timestamp: "2026-07-05T11:15:00Z",
  },
  {
    id: "act-4",
    action: "Goal Created",
    category: "Goals",
    description: "Tatil birikimi finansal hedefi oluşturuldu.",
    user: "Aygen",
    date: "2026-07-04",
    time: "18:45:00",
    icon: "Award",
    status: "success",
    timestamp: "2026-07-04T18:45:00Z",
  },
  {
    id: "act-5",
    action: "Subscription Added",
    category: "Subscriptions",
    description: "Netflix abonelik takibi eklendi.",
    user: "Aygen",
    date: "2026-07-04",
    time: "09:30:00",
    icon: "CreditCard",
    status: "success",
    timestamp: "2026-07-04T09:30:00Z",
  },
];

// Async Thunks
export const fetchActivities = createAsyncThunk("activity/fetchActivities", async () => {
  try {
    const response = await api.get<ActivityLog[]>("/activities");
    return response.data.length > 0 ? response.data : MOCK_INITIAL_LOGS;
  } catch {
    return MOCK_INITIAL_LOGS;
  }
});

export const addActivityLog = createAsyncThunk(
  "activity/addActivityLog",
  async (newLog: Omit<ActivityLog, "id" | "date" | "time" | "timestamp">) => {
    const timestamp = new Date().toISOString();
    const date = timestamp.split("T")[0];
    const time = timestamp.split("T")[1].substring(0, 8);
    const id = `act-${Math.random().toString(36).substr(2, 9)}`;

    const logWithMeta: ActivityLog = {
      ...newLog,
      id,
      date,
      time,
      timestamp,
    };

    try {
      const response = await api.post<ActivityLog>("/activities", logWithMeta);
      return response.data;
    } catch {
      return logWithMeta;
    }
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
        state.error = action.error.message || "Aktiviteler yüklenemedi";
      })
      .addCase(addActivityLog.fulfilled, (state, action: PayloadAction<ActivityLog>) => {
        state.logs.unshift(action.payload);
      });
  },
});

export const { clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
