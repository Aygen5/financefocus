import apiClient from "./client";
import { setupInterceptors } from "./interceptors";

export const api = setupInterceptors(apiClient);

export * from "./client";
export * from "./endpoints";
export default api;
