import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchPortfolio } from "@/features/portfolio/portfolioSlice";
import NetWorthSummary from "@/features/portfolio/components/NetWorthSummary";
import AllocationChart from "@/features/portfolio/components/AllocationChart";
import type { AllocationItem } from "@/features/portfolio/components/AllocationChart";
import HoldingsTable from "@/features/portfolio/components/HoldingsTable";
import type { AssetHolding } from "@/features/portfolio/components/HoldingsTable";
import toast from "react-hot-toast";

const Portfolio: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.portfolio);

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  const handleExport = () => {
    toast.success("Portföy detayları dışa aktarılıyor.");
  };

  // Mock Portföy Özet Değerleri (Arayüz şablonuna göre uyumlu)
  const assetsTotal = 135000;
  const liabilitiesTotal = 10500;
  const netWorth = assetsTotal - liabilitiesTotal; // 124,500

  // Mock Varlık Dağılım Grafiği Verisi
  const allocationData: AllocationItem[] = [
    { name: "Stocks & Equities", value: 81000, color: "#004ac6", percentage: 60 },
    { name: "Cash & Equivalents", value: 27000, color: "#16a34a", percentage: 20 },
    { name: "Real Estate", value: 13500, color: "#bc4800", percentage: 10 },
    { name: "Crypto Assets", value: 13500, color: "#505f76", percentage: 10 },
  ];

  // Mock Detaylı Holdings Verisi
  const holdingsData: AssetHolding[] = [
    {
      symbol: "VTI",
      name: "Vanguard Total Stock Market",
      shares: "420.5 Shares",
      category: "Equities",
      value: 55200,
      change24h: 1.2,
      allocation: 40.8,
    },
    {
      symbol: "USD",
      name: "US Dollar Cash",
      shares: "Checking Account",
      category: "Cash",
      value: 20000,
      change24h: 0.0,
      allocation: 14.8,
    },
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: "150 Shares",
      category: "Equities",
      value: 25800,
      change24h: -0.8,
      allocation: 19.1,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      shares: "0.25 BTC",
      category: "Crypto",
      value: 13500,
      change24h: 4.5,
      allocation: 10.0,
    },
  ];

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Portfolio Overview</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          Track your global assets and market performance.
        </p>
      </div>

      {/* Summary Section: NetWorth & Allocation charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <NetWorthSummary
          netWorth={netWorth}
          assetsTotal={assetsTotal}
          liabilitiesTotal={liabilitiesTotal}
          trend={2.4}
          trendValue={2988}
          loading={loading}
        />

        <div className="col-span-1 lg:col-span-2">
          <AllocationChart data={allocationData} totalValue={assetsTotal} loading={loading} />
        </div>
      </div>

      {/* Detailed Table */}
      <HoldingsTable assets={holdingsData} loading={loading} onExport={handleExport} />
    </div>
  );
};

export default Portfolio;
