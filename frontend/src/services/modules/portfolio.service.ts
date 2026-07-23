import portfolioApi from "@/api/portfolioApi";
import type { CreatePortfolioAssetDto } from "@/api/portfolioApi";
import type { AssetAllocation } from "@/features/portfolio/portfolioSlice";

export const PortfolioService = {
  getAll: async (): Promise<AssetAllocation[]> => {
    const response = await portfolioApi.getAll();
    return (response.data || []).map((p) => ({
      id: p.id,
      name: p.name,
      symbol: p.symbol,
      amount: p.amount,
      purchasePrice: p.purchasePrice,
      currentPrice: p.currentPrice,
      assetType: p.assetType,
      value: p.currentValue,
      percentage: p.profitLossPercentage,
    })) as unknown as AssetAllocation[];
  },

  create: async (data: CreatePortfolioAssetDto) => {
    const response = await portfolioApi.create(data);
    return response.data;
  },

  update: async (id: string, data: CreatePortfolioAssetDto) => {
    const response = await portfolioApi.update(id, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await portfolioApi.delete(id);
    return response.data;
  },
};

export default PortfolioService;
