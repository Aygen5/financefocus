import activityApi from "@/api/activityApi";
import type { ActivityLog } from "@/features/activity/activitySlice";

export const ActivityLogService = {
  getAll: async (): Promise<ActivityLog[]> => {
    const response = await activityApi.getAll();
    return (response.data || []).map((a) => ({
      id: a.id,
      action: a.action,
      timestamp: a.createdAt,
      description: a.description || a.title,
    })) as unknown as ActivityLog[];
  },
};

export default ActivityLogService;
