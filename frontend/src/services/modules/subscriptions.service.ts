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
      price: s.price || 0,
      cost: s.price || 0,
      billingCycle: s.billingCycle || "Monthly",
      nextBillingDate: s.nextBillingDate || new Date().toISOString(),
      category: s.category || "Genel",
      isActive: s.isActive !== undefined ? s.isActive : true,
      status: s.isActive ? "active" : "paused",
    })) as Subscription[];
  },

  create: async (data: Omit<Subscription, "id" | "userId">): Promise<Subscription> => {
    const dataObj = data as Record<string, unknown>;
    const numPrice =
      typeof data.price === "number" ? data.price : typeof data.cost === "number" ? data.cost : 0;

    const payload: CreateSubscriptionDto = {
      name: data.name,
      price: numPrice,
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
      cost: response.data.price,
      billingCycle: response.data.billingCycle,
      nextBillingDate: response.data.nextBillingDate,
      category: response.data.category,
      isActive: response.data.isActive,
      status: response.data.isActive ? "active" : "paused",
    } as Subscription;
  },

  update: async (id: string, data: Partial<Subscription>): Promise<Subscription> => {
    const dataObj = data as Record<string, unknown>;
    const numPrice =
      typeof data.price === "number" ? data.price : typeof data.cost === "number" ? data.cost : 0;

    const payload: CreateSubscriptionDto = {
      name: data.name || "",
      price: numPrice,
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
      cost: response.data.price,
      billingCycle: response.data.billingCycle,
      nextBillingDate: response.data.nextBillingDate,
      category: response.data.category,
      isActive: response.data.isActive,
      status: response.data.isActive ? "active" : "paused",
    } as Subscription;
  },

  delete: async (id: string): Promise<void> => {
    await subscriptionApi.delete(id);
  },
};

export default SubscriptionsService;
