import subscriptionApi from "@/api/subscriptionApi";
import type { CreateSubscriptionDto } from "@/api/subscriptionApi";
import type { Subscription } from "@/features/subscriptions/subscriptionsSlice";

export const SubscriptionsService = {
  getAll: async (): Promise<Subscription[]> => {
    const response = await subscriptionApi.getAll();
    return (response.data || []).map((s) => ({
      id: s.id,
      userId: s.userId,
      name: s.name,
      price: s.price,
      billingCycle: s.billingCycle,
      nextBillingDate: s.nextBillingDate,
      category: s.category,
      isActive: s.isActive,
    })) as unknown as Subscription[];
  },

  create: async (data: Omit<Subscription, "id" | "userId">): Promise<Subscription> => {
    const dataObj = data as Record<string, unknown>;
    const payload: CreateSubscriptionDto = {
      name: data.name,
      price: data.price,
      billingCycle: typeof dataObj.billingCycle === "string" ? dataObj.billingCycle : "Monthly",
      nextBillingDate:
        typeof dataObj.nextBillingDate === "string"
          ? dataObj.nextBillingDate
          : new Date().toISOString(),
      category: data.category || "Genel",
      isActive: data.isActive !== undefined ? data.isActive : true,
    };
    const response = await subscriptionApi.create(payload);
    return {
      id: response.data.id,
      userId: response.data.userId,
      name: response.data.name,
      price: response.data.price,
      billingCycle: response.data.billingCycle,
      nextBillingDate: response.data.nextBillingDate,
      category: response.data.category,
      isActive: response.data.isActive,
    } as unknown as Subscription;
  },

  update: async (id: string, data: Partial<Subscription>): Promise<Subscription> => {
    const dataObj = data as Record<string, unknown>;
    const payload: CreateSubscriptionDto = {
      name: data.name || "",
      price: data.price || 0,
      billingCycle: typeof dataObj.billingCycle === "string" ? dataObj.billingCycle : "Monthly",
      nextBillingDate:
        typeof dataObj.nextBillingDate === "string"
          ? dataObj.nextBillingDate
          : new Date().toISOString(),
      category: data.category || "Genel",
      isActive: data.isActive !== undefined ? data.isActive : true,
    };
    const response = await subscriptionApi.update(id, payload);
    return {
      id: response.data.id,
      userId: response.data.userId,
      name: response.data.name,
      price: response.data.price,
      billingCycle: response.data.billingCycle,
      nextBillingDate: response.data.nextBillingDate,
      category: response.data.category,
      isActive: response.data.isActive,
    } as unknown as Subscription;
  },

  delete: async (id: string): Promise<void> => {
    await subscriptionApi.delete(id);
  },
};

export default SubscriptionsService;
