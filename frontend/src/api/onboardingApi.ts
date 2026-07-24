import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";

export const onboardingApi = {
  seedDemoData: async (): Promise<ApiResponse<boolean>> => {
    const res = await axiosClient.post<ApiResponse<boolean>>("/onboarding/seed-demo-data");
    return res.data;
  },
};

export default onboardingApi;
