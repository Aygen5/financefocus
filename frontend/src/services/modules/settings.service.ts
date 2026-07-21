import api from "../api";
import ENDPOINTS from "../api/endpoints";
import type { UserSettings } from "@/features/settings/settingsSlice";

export const SettingsService = {
  get: async (): Promise<UserSettings> => {
    const response = await api.get<UserSettings>(ENDPOINTS.SETTINGS.BASE);
    return response.data;
  },

  update: async (data: Partial<UserSettings>): Promise<UserSettings> => {
    const response = await api.put<UserSettings>(ENDPOINTS.SETTINGS.BASE, data);
    return response.data;
  },
};

export default SettingsService;
