import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  calculatePercentage,
  calculateTrend,
  calculateNetWorth,
  calculateSavingsRate,
} from "../utils/financial";
import type { FinancialAsset } from "../utils/financial";

describe("Financial Utility Functions Tests", () => {
  describe("formatCurrency", () => {
    it("should format correctly as TRY currency with Turkish symbol", () => {
      const result = formatCurrency(1250.5);
      expect(result).toContain("₺");
      expect(result).toContain("1.250,50");
    });

    it("should format 0 correctly", () => {
      const result = formatCurrency(0);
      expect(result).toContain("0,00");
    });
  });

  describe("calculatePercentage", () => {
    it("should return correct percentage rounded to nearest integer", () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(1, 3)).toBe(33);
    });

    it("should handle division by zero safely by returning 0", () => {
      expect(calculatePercentage(50, 0)).toBe(0);
    });
  });

  describe("calculateTrend", () => {
    it("should return positive change rate", () => {
      expect(calculateTrend(120, 100)).toBe(20.0);
    });

    it("should return negative change rate", () => {
      expect(calculateTrend(80, 100)).toBe(-20.0);
    });

    it("should handle previous value zero safely", () => {
      expect(calculateTrend(100, 0)).toBe(0);
    });
  });

  describe("calculateNetWorth", () => {
    it("should sum up assets correctly in base currency (TRY)", () => {
      const mockAssets: FinancialAsset[] = [
        {
          name: "Vakıfbank Mevduat",
          symbol: "TRY_CASH",
          type: "cash",
          amount: 10000,
          avgCost: 1,
          currentPrice: 1,
          currency: "TRY",
          sector: "Bank",
        },
        {
          name: "Altın",
          symbol: "GOLD",
          type: "gold",
          amount: 5,
          avgCost: 2000,
          currentPrice: 2200,
          currency: "TRY",
          sector: "Precious Metals",
        },
      ];
      expect(calculateNetWorth(mockAssets)).toBe(21000);
    });

    it("should convert USD assets with correct rate", () => {
      const mockAssets: FinancialAsset[] = [
        {
          name: "Apple Stock",
          symbol: "AAPL",
          type: "stocks",
          amount: 10,
          avgCost: 150,
          currentPrice: 180,
          currency: "USD",
          sector: "Technology",
        },
      ];
      expect(calculateNetWorth(mockAssets, 34.0)).toBe(61200);
    });
  });

  describe("calculateSavingsRate", () => {
    it("should calculate correct savings rate", () => {
      expect(calculateSavingsRate(10000, 7000)).toBe(30);
    });

    it("should return 0 if expenses exceed income", () => {
      expect(calculateSavingsRate(5000, 6000)).toBe(0);
    });

    it("should handle zero income safely", () => {
      expect(calculateSavingsRate(0, 3000)).toBe(0);
    });
  });
});
