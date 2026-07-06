import apiClient from "./client";
import { setupInterceptors } from "./interceptors";

// Setup global interceptors for standard apiClient instance
export const api = setupInterceptors(apiClient);

export * from "./client";
export * from "./endpoints";
export default api;
