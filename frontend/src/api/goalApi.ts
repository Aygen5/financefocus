import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";

export interface GoalDto {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  progressPercentage: number;
  userId: string;
}

export interface CreateGoalDto {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export type UpdateGoalDto = CreateGoalDto;

export const goalApi = {
  getAll: async (): Promise<ApiResponse<GoalDto[]>> => {
    const res = await axiosClient.get<ApiResponse<GoalDto[]>>("/goals");
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<GoalDto>> => {
    const res = await axiosClient.get<ApiResponse<GoalDto>>(`/goals/${id}`);
    return res.data;
  },

  create: async (data: CreateGoalDto): Promise<ApiResponse<GoalDto>> => {
    const res = await axiosClient.post<ApiResponse<GoalDto>>("/goals", data);
    return res.data;
  },

  update: async (id: string, data: UpdateGoalDto): Promise<ApiResponse<GoalDto>> => {
    const res = await axiosClient.put<ApiResponse<GoalDto>>(`/goals/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosClient.delete<ApiResponse<boolean>>(`/goals/${id}`);
    return res.data;
  },
};

export default goalApi;
