import api from "../api";
import ENDPOINTS from "../api/endpoints";
import type { SystemNotification } from "@/features/notifications/notificationsSlice";

export const NotificationsService = {
  getAll: async (): Promise<SystemNotification[]> => {
    const response = await api.get<SystemNotification[]>(ENDPOINTS.NOTIFICATIONS.BASE);
    return response.data;
  },

  markRead: async (id: string): Promise<SystemNotification> => {
    const response = await api.patch<SystemNotification>(ENDPOINTS.NOTIFICATIONS.DETAIL(id), {
      read: true,
    });
    return response.data;
  },

  markAllRead: async (): Promise<void> => {
    await api.post(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {});
  },
};

export default NotificationsService;
