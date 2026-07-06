import api from "../api";
import ENDPOINTS from "../api/endpoints";
import type { AssetAllocation } from "@/features/portfolio/portfolioSlice";

export const PortfolioService = {
  getAll: async (): Promise<AssetAllocation[]> => {
    const response = await api.get<AssetAllocation[]>(ENDPOINTS.PORTFOLIO.BASE);
    return response.data;
  },
};

export default PortfolioService;
