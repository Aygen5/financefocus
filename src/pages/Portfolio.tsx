import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchPortfolio,
  selectPortfolio,
  selectPortfolioLoading,
  selectPortfolioError,
} from "@/features/portfolio/portfolioSlice";
import NetWorthSummary from "@/features/portfolio/components/NetWorthSummary";
import AllocationChart from "@/features/portfolio/components/AllocationChart";
import type { AllocationItem } from "@/features/portfolio/components/AllocationChart";
import HoldingsTable from "@/features/portfolio/components/HoldingsTable";
import type { AssetHolding } from "@/features/portfolio/components/HoldingsTable";
import {
  calculateNetWorth,
  calculateTotalPortfolioProfitLoss,
  calculateTotalPortfolioChangeRate,
  calculateLargestAsset,
  calculatePortfolioAssetAllocation,
  calculateAssetValue,
  calculateAssetPercentageChange,
} from "@/utils/financial";
import { SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import ErrorState from "@/components/feedback/ErrorState";
import EmptyState from "@/components/feedback/EmptyState";
import toast from "react-hot-toast";
import { AlertCircle, RotateCcw } from "lucide-react";

const colors = [
  "#004ac6",
  "#16a34a",
  "#bc4800",
  "#505f76",
  "#8b5cf6",
  "#eab308",
  "#06b6d4",
  "#ec4899",
];

const Portfolio: React.FC = () => {
  const dispatch = useAppDispatch();
  const assets = useAppSelector(selectPortfolio);
  const loading = useAppSelector(selectPortfolioLoading);
  const error = useAppSelector(selectPortfolioError);

  const loadData = React.useCallback(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = () => {
    toast.success("Portföy detayları dışa aktarılıyor.");
  };

  const assetsTotal = useMemo(() => calculateNetWorth(assets), [assets]);
  const totalProfitLoss = useMemo(() => calculateTotalPortfolioProfitLoss(assets), [assets]);
  const trend = useMemo(() => calculateTotalPortfolioChangeRate(assets), [assets]);

  const largestAsset = useMemo(() => calculateLargestAsset(assets), [assets]);
  const largestAssetName = largestAsset ? largestAsset.symbol : "Yok";
  const largestAssetValue = largestAsset ? calculateAssetValue(largestAsset) : 0;

  const allocationData: AllocationItem[] = useMemo(() => {
    const rawAllocations = calculatePortfolioAssetAllocation(assets);
    return rawAllocations.map((alloc, idx) => ({
      name: alloc.name,
      value: alloc.value,
      color: colors[idx % colors.length],
      percentage: assetsTotal > 0 ? Math.round((alloc.value / assetsTotal) * 100) : 0,
    }));
  }, [assets, assetsTotal]);

  const holdingsData: AssetHolding[] = useMemo(() => {
    return assets.map((asset) => {
      const val = calculateAssetValue(asset);
      const change = calculateAssetPercentageChange(asset);
      const allocRatio = assetsTotal > 0 ? Number(((val / assetsTotal) * 100).toFixed(1)) : 0;

      let catName = "Diğer";
      switch (asset.type) {
        case "stocks":
          catName = asset.currency === "USD" ? "ABD Hisse" : "BIST Hisse";
          break;
        case "gold":
          catName = "Altın";
          break;
        case "silver":
          catName = "Gümüş";
          break;
        case "crypto":
          catName = "Kripto";
          break;
        case "fund":
          catName = "Fon";
          break;
        case "etf":
          catName = "ETF";
          break;
        case "cash":
          catName = "Döviz";
          break;
      }

      return {
        id: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        shares: `${asset.amount} ${asset.type === "gold" || asset.type === "silver" ? "Gr" : "Adet"}`,
        category: catName,
        value: val,
        change24h: change,
        allocation: allocRatio,
      };
    });
  }, [assets, assetsTotal]);

  if (loading) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left space-y-8 select-none">
        <div className="space-y-2">
          <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard hasAvatar={false} lines={2} className="h-64" />
          <div className="lg:col-span-2">
            <SkeletonCard hasAvatar={false} lines={3} className="h-64" />
          </div>
        </div>
        <SkeletonTable columns={5} rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left py-12">
        <ErrorState
          title="Portföy Yüklenemedi"
          description="Varlık verileri sunucudan çekilirken bir problem yaşandı. Lütfen tekrar deneyiniz."
          icon={<AlertCircle size={24} />}
          onRetry={loadData}
          retryLabel="Yeniden Dene"
          retryIcon={<RotateCcw size={16} />}
        />
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left py-12">
        <EmptyState
          title="Portföy Bulunamadı"
          description="Henüz portföyünüzde herhangi bir yatırım varlığı bulunmamaktadır. İlk varlığınızı ekleyerek bütçenizi zenginleştirebilirsiniz."
          primaryActionLabel="Yeniden Dene"
          onPrimaryActionClick={loadData}
          primaryActionIcon={<RotateCcw size={16} />}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="mb-8 select-none">
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
          Portföy Analizi
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant font-medium mt-1">
          Küresel varlık yatırımlarınızı, maliyet oranlarınızı ve anlık kâr/zarar performansınızı
          izleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <NetWorthSummary
          netWorth={assetsTotal}
          assetsTotal={assetsTotal}
          largestAssetName={largestAssetName}
          largestAssetValue={largestAssetValue}
          trend={trend}
          trendValue={totalProfitLoss}
          loading={false}
        />

        <div className="col-span-1 lg:col-span-2">
          <AllocationChart data={allocationData} totalValue={assetsTotal} loading={false} />
        </div>
      </div>

      <HoldingsTable assets={holdingsData} loading={false} onExport={handleExport} />
    </div>
  );
};

export default Portfolio;
