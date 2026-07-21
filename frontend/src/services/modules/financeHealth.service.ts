import api from "../api";
import ENDPOINTS from "../api/endpoints";

export const FinanceHealthService = {
  getAll: async (): Promise<unknown[]> => {
    const response = await api.get<unknown[]>(ENDPOINTS.FINANCE_HEALTH.BASE);
    return response.data;
  },
};

export default FinanceHealthService;
