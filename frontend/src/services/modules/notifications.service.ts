import notificationApi from "@/api/notificationApi";
import type { SystemNotification } from "@/features/notifications/notificationsSlice";

export const NotificationsService = {
  getAll: async (): Promise<SystemNotification[]> => {
    const response = await notificationApi.getAll();
    return (response.data || []).map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      read: n.isRead,
      createdAt: n.createdAt,
      type: n.category || "info",
    })) as unknown as SystemNotification[];
  },

  markRead: async (id: string): Promise<SystemNotification> => {
    await notificationApi.markAsRead(id);
    return {
      id,
      read: true,
    } as unknown as SystemNotification;
  },

  markAllRead: async (): Promise<void> => {
    await notificationApi.markAllAsRead();
  },
};

export default NotificationsService;
