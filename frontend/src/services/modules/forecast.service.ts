import forecastApi, { ForecastDto } from "@/api/forecastApi";

export const ForecastService = {
  getForecast: async (): Promise<ForecastDto> => {
    const response = await forecastApi.getFullForecast();
    return response.data;
  },
  getSummary: async () => {
    const response = await forecastApi.getSummary();
    return response.data;
  },
};

export default ForecastService;
