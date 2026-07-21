import api from "../api";
import ENDPOINTS from "../api/endpoints";
import type { Subscription } from "@/features/subscriptions/subscriptionsSlice";

export const SubscriptionsService = {
  getAll: async (): Promise<Subscription[]> => {
    const response = await api.get<Subscription[]>(ENDPOINTS.SUBSCRIPTIONS.BASE);
    return response.data;
  },

  create: async (data: Omit<Subscription, "id" | "userId">): Promise<Subscription> => {
    const response = await api.post<Subscription>(ENDPOINTS.SUBSCRIPTIONS.BASE, {
      ...data,
      userId: "1",
    });
    return response.data;
  },

  update: async (id: string, data: Partial<Subscription>): Promise<Subscription> => {
    const response = await api.patch<Subscription>(ENDPOINTS.SUBSCRIPTIONS.DETAIL(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.SUBSCRIPTIONS.DETAIL(id));
  },
};

export default SubscriptionsService;
