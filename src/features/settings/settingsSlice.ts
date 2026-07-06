import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserSettings {
  currency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: string;
  timezone: string;
  twoFactorEnabled: boolean;
  dateFormat: string;
  numberFormat: string;
  profilePicture?: string;
  fullName: string;
  email: string;
  bio?: string;
}

export interface SettingsState {
  settings: UserSettings;
  loading: boolean;
  error: string | null;
}

const defaultSettings: UserSettings = {
  currency: "TRY",
  emailNotifications: true,
  pushNotifications: true,
  language: "Turkish",
  timezone: "Europe/Istanbul",
  twoFactorEnabled: false,
  dateFormat: "dd.MM.yyyy",
  numberFormat: "Turkish",
  fullName: "Aygen",
  email: "aygen@financefocus.com",
  bio: "Finansal özgürlük yolcusu.",
};

const initialState: SettingsState = {
  settings: defaultSettings,
  loading: false,
  error: null,
};

// Async Thunks integrated with LocalStorage
export const fetchSettings = createAsyncThunk("settings/fetchSettings", async () => {
  const localData = localStorage.getItem("user_settings");
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      return { ...defaultSettings, ...parsed } as UserSettings;
    } catch {
      return defaultSettings;
    }
  }
  localStorage.setItem("user_settings", JSON.stringify(defaultSettings));
  return defaultSettings;
});

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (data: Partial<UserSettings>, { getState }) => {
    const state = getState() as { settings: SettingsState };
    const updated = { ...state.settings.settings, ...data };
    localStorage.setItem("user_settings", JSON.stringify(updated));
    return updated;
  },
);

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetSettings: (state) => {
      state.settings = defaultSettings;
      localStorage.setItem("user_settings", JSON.stringify(defaultSettings));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<UserSettings>) => {
        state.loading = false;
        state.settings = action.payload;
        state.error = null;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ayarlar yüklenemedi";
      })
      .addCase(updateSettings.fulfilled, (state, action: PayloadAction<UserSettings>) => {
        state.settings = action.payload;
      });
  },
});

// Selectors
export const selectSettings = (state: { settings: SettingsState }) => state.settings.settings;
export const selectSettingsLoading = (state: { settings: SettingsState }) => state.settings.loading;
export const selectSettingsError = (state: { settings: SettingsState }) => state.settings.error;

export const { resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
