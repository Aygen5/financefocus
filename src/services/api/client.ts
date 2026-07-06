import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

// BaseURL can be overridden by env variable VITE_API_URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic Response wrapper type for standard API responses
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Custom request helper that returns clean typed AxiosResponse
export async function request<T>(
  config: Parameters<AxiosInstance["request"]>[0],
): Promise<AxiosResponse<T>> {
  return apiClient.request<T>(config);
}

export default apiClient;
