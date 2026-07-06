/* eslint-disable no-console */
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getLocalData, saveLocalData } from "@/utils/localStorageDb";
import toast from "react-hot-toast";

/**
 * local database helper to intercept and handle connections when the api server is offline
 */
const handleLocalFallback = (config: InternalAxiosRequestConfig): AxiosResponse | null => {
  const method = config.method?.toUpperCase();
  const url = config.url || "";

  // Clean endpoint
  let endpoint = url.replace(/^\//, "").split("?")[0];
  if (endpoint.startsWith("transactions")) endpoint = "transactions";
  if (endpoint.startsWith("budget") || endpoint.startsWith("budgets")) endpoint = "budget";
  if (endpoint.startsWith("portfolio")) endpoint = "portfolio";
  if (endpoint.startsWith("goals")) endpoint = "goals";
  if (endpoint.startsWith("subscriptions")) endpoint = "subscriptions";
  if (endpoint.startsWith("notifications")) endpoint = "notifications";
  if (endpoint.startsWith("activities")) endpoint = "activities";

  const validEndpoints = [
    "transactions",
    "budget",
    "portfolio",
    "goals",
    "subscriptions",
    "notifications",
    "activities",
    "settings",
  ];
  if (!validEndpoints.includes(endpoint)) {
    return null;
  }

  const localData = getLocalData(endpoint);

  // GET Request
  if (method === "GET") {
    // If it's a detail request (e.g. /transactions/tx-1)
    const parts = url.split("/");
    if (parts.length > 2) {
      const id = parts[2];
      const item = Array.isArray(localData)
        ? localData.find((x: unknown) => (x as { id: string }).id === id)
        : null;
      return {
        data: item,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    }

    return {
      data: localData,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  }

  // POST Request (Create)
  if (method === "POST") {
    const payload = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
    const newId = `${endpoint.substring(0, 3)}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem = { ...payload, id: payload.id || newId };

    if (Array.isArray(localData)) {
      localData.push(newItem);
      saveLocalData(endpoint, localData);
    }

    return {
      data: newItem,
      status: 201,
      statusText: "Created",
      headers: {},
      config,
    };
  }

  // PUT Request (Update)
  if (method === "PUT") {
    const payload = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
    const parts = url.split("/");
    const id = parts[parts.length - 1];

    if (Array.isArray(localData)) {
      const index = localData.findIndex((x: unknown) => (x as { id: string }).id === id);
      if (index !== -1) {
        const itemObj = localData[index] as Record<string, unknown>;
        localData[index] = { ...itemObj, ...payload };
        saveLocalData(endpoint, localData);
        return {
          data: localData[index],
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        };
      }
    }
  }

  // DELETE Request
  if (method === "DELETE") {
    const parts = url.split("/");
    const id = parts[parts.length - 1];

    if (Array.isArray(localData)) {
      const updated = localData.filter((x: unknown) => (x as { id: string }).id !== id);
      saveLocalData(endpoint, updated);
      return {
        data: { success: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    }
  }

  return null;
};

let isServerOffline = false;

export const setupInterceptors = (client: AxiosInstance): AxiosInstance => {
  // Request Interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // If we already know the server is offline, bypass request and return fallback data immediately
      if (isServerOffline) {
        const fallbackResponse = handleLocalFallback(config);
        if (fallbackResponse) {
          // Force Axios to resolve early with the fallback response
          config.adapter = () => Promise.resolve(fallbackResponse);
        }
      }

      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response Interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const config = error.config;

      // If server is offline or requests timeout, fallback to LocalStorage and mark server as offline
      if (
        !error.response ||
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        error.message.includes("Network Error") ||
        error.message.includes("timeout")
      ) {
        if (!isServerOffline) {
          isServerOffline = true;
          console.warn("API Server offline, switching to fast LocalStorage fallback mode.");
        }
        const fallbackResponse = handleLocalFallback(config);
        if (fallbackResponse) {
          return fallbackResponse;
        }
      }

      const message = error.response?.data?.message || "Bir sunucu hatası oluştu.";
      const status = error.response?.status;

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Oturum süreniz doldu, lütfen tekrar giriş yapın.");
      } else {
        toast.error(message);
      }

      return Promise.reject(error);
    },
  );

  return client;
};

export default setupInterceptors;
