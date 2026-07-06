import api from "../api";
import ENDPOINTS from "../api/endpoints";
import type { ActivityLog } from "@/features/activity/activitySlice";

export const ActivityLogService = {
  getAll: async (): Promise<ActivityLog[]> => {
    const response = await api.get<ActivityLog[]>(ENDPOINTS.ACTIVITY_LOG.BASE);
    return response.data;
  },
};

export default ActivityLogService;
