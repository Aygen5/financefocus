import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export const authApi = {
  login: async (credentials: LoginRequestDto): Promise<ApiResponse<AuthResponseDto>> => {
    const res = await axiosClient.post<ApiResponse<AuthResponseDto>>("/auth/login", credentials);
    return res.data;
  },

  register: async (userData: RegisterRequestDto): Promise<ApiResponse<AuthResponseDto>> => {
    const res = await axiosClient.post<ApiResponse<AuthResponseDto>>("/auth/register", userData);
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<UserDto>> => {
    const res = await axiosClient.get<ApiResponse<UserDto>>("/auth/me");
    return res.data;
  },
};

export default authApi;
