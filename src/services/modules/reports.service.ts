import api from "../api";
import ENDPOINTS from "../api/endpoints";
import type { FinancialReport } from "@/features/reports/reportsSlice";

export const ReportsService = {
  getAll: async (): Promise<FinancialReport[]> => {
    const response = await api.get<FinancialReport[]>(ENDPOINTS.REPORTS.BASE);
    return response.data;
  },

  getById: async (id: string): Promise<FinancialReport> => {
    const response = await api.get<FinancialReport>(ENDPOINTS.REPORTS.DETAIL(id));
    return response.data;
  },
};

export default ReportsService;
