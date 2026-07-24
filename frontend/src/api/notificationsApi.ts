import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: number;
  isRead: boolean;
  category: string;
  userId: string;
  createdAt: string;
}

export const notificationsApi = {
  getAll: async (): Promise<ApiResponse<NotificationDto[]>> => {
    const res = await axiosClient.get<ApiResponse<NotificationDto[]>>("/notifications");
    return res.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosClient.patch<ApiResponse<boolean>>(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<boolean>> => {
    const res = await axiosClient.patch<ApiResponse<boolean>>("/notifications/read-all");
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosClient.delete<ApiResponse<boolean>>(`/notifications/${id}`);
    return res.data;
  },
};

export default notificationsApi;
