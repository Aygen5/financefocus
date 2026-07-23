import financialHealthApi, { FinancialHealthDto } from "@/api/financialHealthApi";

export const FinanceHealthService = {
  getHealth: async (): Promise<FinancialHealthDto> => {
    const response = await financialHealthApi.getFullHealth();
    return response.data;
  },
  getSummary: async () => {
    const response = await financialHealthApi.getSummary();
    return response.data;
  },
};

export default FinanceHealthService;
