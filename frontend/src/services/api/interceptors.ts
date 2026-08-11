import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

export const setupInterceptors = (client: AxiosInstance): AxiosInstance => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
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

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const message = error.response?.data?.message || "Bir sunucu hatası oluştu.";
      const status = error.response?.status;

      if (status === 401) {
        localStorage.clear();
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
