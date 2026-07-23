import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: number;
  isRead: boolean;
  category: string;
  createdAt: string;
  userId: string;
}

export const notificationApi = {
  getAll: async (): Promise<ApiResponse<NotificationDto[]>> => {
    const res = await axiosClient.get<ApiResponse<NotificationDto[]>>("/notifications");
    return res.data;
  },

  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    const res = await axiosClient.get<ApiResponse<number>>("/notifications/unread-count");
    return res.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosClient.post<ApiResponse<boolean>>(`/notifications/${id}/mark-read`);
    return res.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<boolean>> => {
    const res = await axiosClient.post<ApiResponse<boolean>>("/notifications/mark-all-read");
    return res.data;
  },
};

export default notificationApi;
