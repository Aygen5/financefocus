import { describe, it, expect } from "vitest";
import portfolioReducer, {
  clearPortfolio,
  PortfolioState,
} from "@/features/portfolio/portfolioSlice";

describe("portfolioSlice reducer", () => {
  const initialState: PortfolioState = {
    assets: [
      {
        id: "a1",
        name: "Gram Altın",
        symbol: "ALTIN",
        amount: 50,
        purchasePrice: 2400,
        currentPrice: 3100,
        assetType: "Gold",
        isDemo: true,
      },
    ],
    loading: false,
    error: null,
  };

  it("should clear all portfolio assets", () => {
    const nextState = portfolioReducer(initialState, clearPortfolio());
    expect(nextState.assets).toHaveLength(0);
  });
});
