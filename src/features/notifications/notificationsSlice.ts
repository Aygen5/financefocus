import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  icon: string;
}

export interface NotificationsState {
  items: SystemNotification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  loading: false,
  error: null,
};

const MOCK_INITIAL_NOTIFS: SystemNotification[] = [
  {
    id: "notif-1",
    title: "Giriş Başarılı",
    message: "FinanceFocus hesabınıza başarıyla giriş yaptınız.",
    type: "success",
    isRead: false,
    createdAt: new Date().toISOString(),
    icon: "LogIn",
  },
  {
    id: "notif-2",
    title: "Bütçe Uyarısı",
    message: "Fatura bütçeniz %80 sınırını aşmıştır.",
    type: "warning",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    icon: "Sliders",
  },
];

// Async Thunks
export const fetchNotifications = createAsyncThunk("notifications/fetchNotifications", async () => {
  try {
    const response = await api.get<SystemNotification[]>("/notifications");
    return response.data.length > 0 ? response.data : MOCK_INITIAL_NOTIFS;
  } catch {
    return MOCK_INITIAL_NOTIFS;
  }
});

export const addNotification = createAsyncThunk(
  "notifications/addNotification",
  async (newNotif: Omit<SystemNotification, "id" | "isRead" | "createdAt">) => {
    const logData: SystemNotification = {
      ...newNotif,
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    try {
      const response = await api.post<SystemNotification>("/notifications", logData);
      return response.data;
    } catch {
      return logData;
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id: string) => {
    try {
      const response = await api.put<SystemNotification>(`/notifications/${id}`, { isRead: true });
      return response.data;
    } catch {
      return { id, isRead: true };
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async (_, { getState }) => {
    const state = getState() as { notifications: NotificationsState };
    const unread = state.notifications.items.filter((item) => !item.isRead);

    try {
      await Promise.all(
        unread.map((item) => api.put(`/notifications/${item.id}`, { isRead: true })),
      );
      return true;
    } catch {
      return true;
    }
  },
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      return id;
    } catch {
      return id;
    }
  },
);

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.items = [];
    },
  },
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
          state.items = action.payload.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          state.error = null;
        },
      )
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Bildirimler yüklenemedi";
      })
      .addCase(addNotification.fulfilled, (state, action: PayloadAction<SystemNotification>) => {
        state.items.unshift(action.payload);
      })
      .addCase(markNotificationRead.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        const item = state.items.find((n) => n.id === action.payload.id);
        if (item) item.isRead = true;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map((item) => ({ ...item, isRead: true }));
      })
      .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
