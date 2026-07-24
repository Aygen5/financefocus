import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import notificationsApi from "@/api/notificationsApi";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  icon: string;
  category?: string;
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

const mapNotificationType = (typeNum: number): "success" | "info" | "warning" | "error" => {
  switch (typeNum) {
    case 0:
      return "info";
    case 1:
      return "success";
    case 2:
      return "warning";
    case 3:
      return "error";
    default:
      return "info";
  }
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.getAll();
      if (response.success && Array.isArray(response.data)) {
        return response.data.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          type: mapNotificationType(item.type),
          isRead: item.isRead,
          createdAt: item.createdAt || new Date().toISOString(),
          icon: "Bell",
          category: item.category,
        }));
      }
      return [];
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Bildirimler yüklenemedi.");
    }
  },
);

export const addNotification = createAsyncThunk(
  "notifications/addNotification",
  async (newNotif: Omit<SystemNotification, "id" | "isRead" | "createdAt">) => {
    const logData: SystemNotification = {
      ...newNotif,
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    return logData;
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationsApi.markAsRead(id);
      return id;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Bildirim okundu işaretlenemedi.");
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationsApi.markAllAsRead();
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Bildirimler okundu işaretlenemedi.");
    }
  },
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationsApi.delete(id);
      return id;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Bildirim silinemedi.");
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
        state.error = (action.payload as string) || "Bildirimler yüklenemedi.";
      })
      .addCase(addNotification.fulfilled, (state, action: PayloadAction<SystemNotification>) => {
        state.items.unshift(action.payload);
      })
      .addCase(markNotificationRead.fulfilled, (state, action: PayloadAction<string>) => {
        const item = state.items.find((n) => n.id === action.payload);
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
