import api from "../api";
import ENDPOINTS from "../api/endpoints";

export const ForecastService = {
  getAll: async (): Promise<unknown[]> => {
    const response = await api.get<unknown[]>(ENDPOINTS.FORECAST.BASE);
    return response.data;
  },
};

export default ForecastService;
