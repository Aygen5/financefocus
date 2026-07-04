/* eslint-disable @typescript-eslint/no-explicit-any, no-console */
import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import initialDb from "@/mocks/db.json";

// LocalStorage anahtarı
const DB_KEY = "financefocus_db";

// Veritabanını ilklendir
if (typeof window !== "undefined" && !localStorage.getItem(DB_KEY)) {
  localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
}

const getDb = () => {
  if (typeof window === "undefined") return initialDb;
  return JSON.parse(localStorage.getItem(DB_KEY) || JSON.stringify(initialDb));
};

const saveDb = (db: typeof initialDb) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }
};

// Axios instance oluştur
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Custom Adapter ile API İsteklerini Kesme (Mock Server)
api.defaults.adapter = async (config) => {
  const { url, method, data: requestData } = config;
  const db = getDb() as any;

  // Gerçekçi ağ gecikmesi simülasyonu
  await new Promise((resolve) => setTimeout(resolve, 600));

  // İstek URL'ini temizle ve parçala
  // Örn: /api/transactions/t1 -> transactions ve t1
  const cleanUrl = url?.replace(/^\/?api\/?/, "") || "";
  const parts = cleanUrl.split("/").filter(Boolean);
  const collection = parts[0];
  const id = parts[1];

  const responseHeaders = { "content-type": "application/json" };

  try {
    // GET Metodu
    if (method?.toLowerCase() === "get") {
      if (!collection) {
        return {
          data: db,
          status: 200,
          statusText: "OK",
          headers: responseHeaders,
          config,
        } as AxiosResponse;
      }

      const list = db[collection];
      if (!list) {
        throw new Error("Collection not found");
      }

      if (id) {
        const item = list.find((x: any) => x.id === id);
        if (!item) {
          return {
            data: { message: "Item not found" },
            status: 404,
            statusText: "Not Found",
            headers: responseHeaders,
            config,
          } as AxiosResponse;
        }
        return {
          data: item,
          status: 200,
          statusText: "OK",
          headers: responseHeaders,
          config,
        } as AxiosResponse;
      }

      return {
        data: list,
        status: 200,
        statusText: "OK",
        headers: responseHeaders,
        config,
      } as AxiosResponse;
    }

    // POST Metodu
    if (method?.toLowerCase() === "post") {
      const list = db[collection];
      if (!list) {
        throw new Error("Collection not found");
      }

      const parsedData = typeof requestData === "string" ? JSON.parse(requestData) : requestData;
      const newItem = {
        ...parsedData,
        id:
          parsedData.id ||
          `${collection.substring(0, 1)}${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      db[collection] = [...list, newItem];
      saveDb(db);

      return {
        data: newItem,
        status: 201,
        statusText: "Created",
        headers: responseHeaders,
        config,
      } as AxiosResponse;
    }

    // PUT/PATCH Metodu
    if (method?.toLowerCase() === "put" || method?.toLowerCase() === "patch") {
      const list = db[collection];
      if (!list || !id) {
        throw new Error("Collection or ID not found");
      }

      const idx = list.findIndex((x: any) => x.id === id);
      if (idx === -1) {
        return {
          data: { message: "Item not found" },
          status: 404,
          statusText: "Not Found",
          headers: responseHeaders,
          config,
        } as AxiosResponse;
      }

      const parsedData = typeof requestData === "string" ? JSON.parse(requestData) : requestData;
      const updatedItem = {
        ...list[idx],
        ...parsedData,
        updatedAt: new Date().toISOString(),
      };

      db[collection][idx] = updatedItem;
      saveDb(db);

      return {
        data: updatedItem,
        status: 200,
        statusText: "OK",
        headers: responseHeaders,
        config,
      } as AxiosResponse;
    }

    // DELETE Metodu
    if (method?.toLowerCase() === "delete") {
      const list = db[collection];
      if (!list || !id) {
        throw new Error("Collection or ID not found");
      }

      const exists = list.some((x: any) => x.id === id);
      if (!exists) {
        return {
          data: { message: "Item not found" },
          status: 404,
          statusText: "Not Found",
          headers: responseHeaders,
          config,
        } as AxiosResponse;
      }

      db[collection] = list.filter((x: any) => x.id !== id);
      saveDb(db);

      return {
        data: { success: true, id },
        status: 200,
        statusText: "OK",
        headers: responseHeaders,
        config,
      } as AxiosResponse;
    }

    // Desteklenmeyen Metot
    return {
      data: { message: "Method not supported in Mock API" },
      status: 405,
      statusText: "Method Not Allowed",
      headers: responseHeaders,
      config,
    } as AxiosResponse;
  } catch (error: any) {
    return {
      data: { message: error.message || "Mock API Server Error" },
      status: 500,
      statusText: "Internal Server Error",
      headers: responseHeaders,
      config,
    } as AxiosResponse;
  }
};

// Response Interceptor - Hata Yakalama ve Bildirim
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Hata mesajını konsola yazdır veya özel işlemleri yap
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

// Request Interceptor - Bearer Token Ekleme Şablonu (Gelecekteki JWT Entegrasyonu İçin)
api.interceptors.request.use(
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

export default api;
