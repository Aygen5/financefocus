/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface SystemNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  timeAgo?: string;
  category?: string;
  threshold?: number;
}

interface NotificationsState {
  items: SystemNotification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/notifications");
      return response.data as SystemNotification[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Bildirimler yüklenemedi");
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async (_, { rejectWithValue }) => {
    try {
      // Mock API'de toplu okunmuş işaretleme yapılsın
      await api.post("/notifications/mark-all-read", {});
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Bildirimler işaretlenemedi");
    }
  },
);

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNotifications.fulfilled,
        (state, action: PayloadAction<SystemNotification[]>) => {
          state.loading = false;
          state.items = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map((item) => ({ ...item, read: true }));
      });
  },
});

export default notificationsSlice.reducer;
