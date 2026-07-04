import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchFinancialHealth } from "@/features/financialHealth/financialHealthSlice";
import HealthGaugeCard from "@/features/financialHealth/components/HealthGaugeCard";
import ComponentAnalysis from "@/features/financialHealth/components/ComponentAnalysis";
import StrategicRecommendations from "@/features/financialHealth/components/StrategicRecommendations";
import HistoricalHealthTrend from "@/features/financialHealth/components/HistoricalHealthTrend";
import type { HealthTrendPoint } from "@/features/financialHealth/components/HistoricalHealthTrend";
import PathToPerfectScore from "@/features/financialHealth/components/PathToPerfectScore";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const FinancialHealth: React.FC = () => {
  const dispatch = useAppDispatch();
  const { score, loading } = useAppSelector((state) => state.financialHealth);

  useEffect(() => {
    dispatch(fetchFinancialHealth());
  }, [dispatch]);

  const handleRecalculate = () => {
    toast.loading("Sağlık skoru yeniden hesaplanıyor...", { id: "recalc" });
    setTimeout(() => {
      dispatch(fetchFinancialHealth());
      toast.success("Skor başarıyla güncellendi!", { id: "recalc" });
    }, 1000);
  };

  const handleViewMetrics = () => {
    toast.success("Detaylı metrikler yükleniyor...");
  };

  const handleAction = (actionName: string) => {
    toast.success(`Aksiyon başlatıldı: ${actionName}`);
  };

  const handleUnlockRoadmap = () => {
    toast.success("Tam yol haritasının kilidi açılıyor.");
  };

  // Mock Trend Verileri
  const trendData: HealthTrendPoint[] = [
    { month: "Jan", score: 78 },
    { month: "Feb", score: 82 },
    { month: "Mar", score: 80 },
    { month: "Apr", score: 85 },
    { month: "May", score: 90 },
    { month: "Jun", score: 92 },
  ];

  return (
    <div className="w-full max-w-container-max mx-auto space-y-stack-lg text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Financial Health Score
          </h2>
          <p className="font-body-md text-body-md text-slate-500 font-medium">
            Comprehensive analysis of your fiscal stability and growth potential.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold select-none">
          <span className="text-slate-400">Son değerlendirme: Bugün, 09:42</span>
          <button
            onClick={handleRecalculate}
            className="text-primary dark:text-brand-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RefreshCw size={14} /> Yeniden Hesapla
          </button>
        </div>
      </div>

      {/* Main Gauge and Component analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8">
          <HealthGaugeCard score={score || 92} loading={loading} />
        </div>
        <div className="lg:col-span-4">
          <ComponentAnalysis
            savingsRatio={98}
            debtToIncome={85}
            budgetVariance={92}
            subscriptionLeakage={78}
            netWorthVelocity={95}
            onViewMetrics={handleViewMetrics}
            loading={loading}
          />
        </div>
      </div>

      {/* Actionable recommendations list */}
      <StrategicRecommendations onAction={handleAction} />

      {/* Comparison Trends grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-7">
          <HistoricalHealthTrend data={trendData} loading={loading} />
        </div>
        <div className="lg:col-span-5">
          <PathToPerfectScore onUnlockRoadmap={handleUnlockRoadmap} />
        </div>
      </div>
    </div>
  );
};

export default FinancialHealth;
