import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";

export interface ActivityLogDto {
  id: string;
  activityType: string;
  action: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  userId: string;
}

export const activityApi = {
  getAll: async (): Promise<ApiResponse<ActivityLogDto[]>> => {
    const res = await axiosClient.get<ApiResponse<ActivityLogDto[]>>("/activitylogs");
    return res.data;
  },

  getLatest: async (count: number = 5): Promise<ApiResponse<ActivityLogDto[]>> => {
    const res = await axiosClient.get<ApiResponse<ActivityLogDto[]>>(
      `/activitylogs/latest?count=${count}`,
    );
    return res.data;
  },
};

export default activityApi;
