/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface UserSettings {
  currency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  language?: string;
  timezone?: string;
  twoFactorEnabled?: boolean;
}

interface SettingsState {
  settings: UserSettings;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: {
    currency: "USD",
    emailNotifications: true,
    pushNotifications: true,
    language: "English",
    timezone: "Pacific Time",
    twoFactorEnabled: true,
  },
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/settings");
      return response.data as UserSettings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Ayarlar yüklenemedi");
    }
  },
);

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (data: Partial<UserSettings>, { rejectWithValue }) => {
    try {
      const response = await api.put("/settings", data);
      return response.data as UserSettings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Ayarlar güncellenemedi");
    }
  },
);

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<UserSettings>) => {
        state.loading = false;
        state.settings = { ...state.settings, ...action.payload };
        state.error = null;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSettings.fulfilled, (state, action: PayloadAction<UserSettings>) => {
        state.settings = { ...state.settings, ...action.payload };
      });
  },
});

export default settingsSlice.reducer;
