import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectThemeMode } from "@/store/themeSlice";
import { fetchTransactions } from "@/features/transactions/transactionsSlice";
import { fetchPortfolio } from "@/features/portfolio/portfolioSlice";
import { fetchBudgets } from "@/features/budget/budgetSlice";
import {
  forecastIncome,
  forecastExpenses,
  forecastCashFlow,
  forecastSavings,
  forecastPortfolioGrowth,
  calculateNetWorth,
  formatCurrency,
} from "@/utils/financial";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
} from "recharts";
import Button from "@/components/ui/Button";
import {
  RotateCcw,
  AlertCircle,
  Info,
  Download,
  Sliders,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { addActivityLog } from "@/features/activity/activitySlice";
import { addNotification } from "@/features/notifications/notificationsSlice";
import ErrorState from "@/components/feedback/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";

export const Forecast: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);

  // Resolve dark condition dynamically
  const isDark = React.useMemo(() => {
    if (themeMode === "dark") return true;
    if (themeMode === "system") {
      return (
        typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return false;
  }, [themeMode]);

  const gridColor = isDark ? "#1e293b" : "#f1f5f9";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipColor = isDark ? "#f8fafc" : "#0f172a";
  const tooltipBorder = isDark ? "#1e293b" : "#e2e8f0";

  // Redux States
  const {
    items: transactions,
    loading: transLoading,
    error: transError,
  } = useAppSelector((state) => state.transactions);
  const {
    assets,
    loading: portLoading,
    error: portError,
  } = useAppSelector((state) => state.portfolio);
  const { loading: budgetsLoading, error: budgetsError } = useAppSelector((state) => state.budget);

  // Forecast Timeframe State
  const [months, setMonths] = useState<number>(6); // Default 6 Months Forecast

  const loadAllData = React.useCallback(() => {
    dispatch(fetchTransactions());
    dispatch(fetchPortfolio());
    dispatch(fetchBudgets());
  }, [dispatch]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Dispatch Forecast Warning alert once metrics are loaded
  useEffect(() => {
    if (!transLoading && transactions.length > 0) {
      const avgInc = forecastIncome(transactions, 1)[0]?.value || 12000;
      const avgExp = forecastExpenses(transactions, 1)[0]?.value || 6500;
      const isNegativeTrend = avgExp > avgInc;

      dispatch(
        addActivityLog({
          action: "Forecast Warning",
          category: "Forecast",
          description: isNegativeTrend
            ? "Negatif nakit akışı eğilimi tespit edildi! Giderler gelirlerden yüksek."
            : "Gelecek dönem finansal tahmin raporu başarıyla oluşturuldu.",
          user: "Aygen",
          icon: "Sliders",
          status: isNegativeTrend ? "warning" : "success",
        }),
      );
      dispatch(
        addNotification({
          title: "Forecast uyarısı",
          message: isNegativeTrend
            ? "Negatif nakit akışı eğilimi tespit edildi! Lütfen bütçenizi kontrol edin."
            : "Finansal tahmin motoru analizlerini tamamladı. Gelecek dönem durumunuz stabil görünüyor.",
          type: isNegativeTrend ? "warning" : "info",
          icon: "Sliders",
        }),
      );
    }
  }, [transLoading, transactions, dispatch]);

  // 1. Tahmin Hesaplamaları (useMemo ile SMA yöntemiyle)
  const forecastMetrics = useMemo(() => {
    // Son 3 ayın ortalama gelir/gider bazlarını çıkaralım
    const histIncomes = forecastIncome(transactions, 1);
    const histExpenses = forecastExpenses(transactions, 1);

    const avgIncome = histIncomes[0]?.value || 12000;
    const avgExpense = histExpenses[0]?.value || 6500;

    const expectedIncome = avgIncome * months;
    const expectedExpense = avgExpense * months;
    const expectedSavings = forecastSavings(avgIncome, avgExpense, months);
    const expectedCashFlow = avgIncome - avgExpense;

    // Beklenen Portföy Değeri (Son ayın kümülatif değeri)
    const growthArray = forecastPortfolioGrowth(assets, transactions, months);
    const expectedPortfolioVal =
      growthArray[growthArray.length - 1]?.value || calculateNetWorth(assets);

    return {
      expectedIncome,
      expectedExpense,
      expectedSavings,
      expectedCashFlow,
      expectedPortfolioVal,
      avgIncome,
      avgExpense,
    };
  }, [transactions, assets, months]);

  // 2. Projeksiyon Grafik Veri Setleri
  const incomeForecastData = useMemo(
    () => forecastIncome(transactions, months),
    [transactions, months],
  );
  const expenseForecastData = useMemo(
    () => forecastExpenses(transactions, months),
    [transactions, months],
  );
  const cashFlowForecastData = useMemo(
    () => forecastCashFlow(transactions, months),
    [transactions, months],
  );
  const portfolioGrowthData = useMemo(
    () => forecastPortfolioGrowth(assets, transactions, months),
    [assets, transactions, months],
  );

  const handleAdjustModel = () => {
    toast.success("Tahmin modeli optimizasyonu (Moving Average) güncellendi.");
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Ay,Beklenen Gelir,Beklenen Gider,Beklenen Net Akis\n" +
      cashFlowForecastData
        .map((e) => `${e.month},${e.income},${e.expense},${e.income - e.expense}`)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Finansal_Tahmin_${months}_Ay.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tahmin projeksiyon verileri CSV olarak aktarıldı.");
  };

  const loading = transLoading || portLoading || budgetsLoading;
  const error = transError || portError || budgetsError;

  // Render loading state
  if (loading) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left space-y-8 select-none">
        <div className="space-y-2">
          <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          ))}
        </div>
        <SkeletonTable columns={4} rows={5} />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left py-12">
        <ErrorState
          title="Tahminler Yüklenemedi"
          description="Geleceğe yönelik tahmin projeksiyonları hesaplanırken bir hata oluştu. Lütfen tekrar deneyiniz."
          onRetry={loadAllData}
          retryLabel="Yeniden Dene"
          retryIcon={<RotateCcw size={16} />}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 select-none">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Tahmin Motoru
          </h2>
          <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400 font-medium mt-1">
            Geçmiş finansal hareketlerinize dayanarak kümülatif gelecek projeksiyonlarınızı analiz
            edin.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>
            Projeksiyonu İndir
          </Button>
          <Button variant="primary" icon={<Sliders size={16} />} onClick={handleAdjustModel}>
            Optimizasyon
          </Button>
        </div>
      </div>

      {/* Model explanation banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 text-slate-750 dark:text-brand-300 p-4 rounded-2xl flex items-start gap-3 mb-6 select-none">
        <Info size={20} className="text-primary dark:text-brand-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider mb-1">
            Tahmin Hesaplama Yöntemi (SMA - Simple Moving Average)
          </h4>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
            Tahminlerimiz, son 3 aya ait harcama ve gelir hareketlerinizin **Hareketli Ortalama
            (Moving Average)** trendleri temel alınarak oluşturulur. Portföy büyümesi hesaplanırken,
            aylık net tasarruflarınızın sisteme enjekte edildiği varsayılır ve varlıkların anlık
            piyasa değerlerine aylık kümülatif %1.2 organik büyüme çarpanı uygulanır.
          </p>
        </div>
      </div>

      {/* Timeframe selector panel */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-soft-sm select-none">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { value: 1, label: "Önümüzdeki 1 Ay" },
            { value: 3, label: "Önümüzdeki 3 Ay" },
            { value: 6, label: "Önümüzdeki 6 Ay" },
            { value: 12, label: "Önümüzdeki 12 Ay" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setMonths(item.value)}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                months === item.value
                  ? "bg-primary text-white"
                  : "bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <CalendarDays size={14} /> Tahmin Ufku: {months} Ay Projeksiyon
        </div>
      </div>

      {/* Forecast metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 select-none">
        {/* Beklenen Gelir */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Beklenen Gelir
          </span>
          <div className="text-base font-black text-emerald-600 dark:text-emerald-450 leading-none">
            {formatCurrency(forecastMetrics.expectedIncome, "TRY")}
          </div>
          <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block mt-2">
            Ort. {formatCurrency(forecastMetrics.avgIncome, "TRY")} / Ay
          </span>
        </div>

        {/* Beklenen Gider */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Beklenen Gider
          </span>
          <div className="text-base font-black text-red-500 dark:text-red-400 leading-none">
            {formatCurrency(forecastMetrics.expectedExpense, "TRY")}
          </div>
          <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block mt-2">
            Ort. {formatCurrency(forecastMetrics.avgExpense, "TRY")} / Ay
          </span>
        </div>

        {/* Beklenen Tasarruf */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Beklenen Tasarruf
          </span>
          <div className="text-base font-black text-slate-850 dark:text-white leading-none">
            {formatCurrency(forecastMetrics.expectedSavings, "TRY")}
          </div>
          <span className="text-[9px] font-black text-emerald-600 mt-2 block">
            Kümülatif birikim tahmini
          </span>
        </div>

        {/* Beklenen Nakit Akışı */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Beklenen Net Akış
          </span>
          <div className="text-base font-black text-slate-850 dark:text-white leading-none">
            {formatCurrency(forecastMetrics.expectedCashFlow, "TRY")}
          </div>
          <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block mt-2">
            Aylık net nakit (Gelir - Gider)
          </span>
        </div>

        {/* Beklenen Portföy Değeri */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Beklenen Portföy
          </span>
          <div className="text-base font-black text-primary dark:text-brand-400 leading-none">
            {formatCurrency(forecastMetrics.expectedPortfolioVal, "TRY")}
          </div>
          <span className="text-[9px] font-black text-emerald-600 mt-2 block flex items-center gap-0.5">
            <TrendingUp size={11} /> {months}. ay sonu tahmini
          </span>
        </div>
      </div>

      {/* Forecast Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter select-none">
        {/* Graph 1: Income Forecast */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-emerald-500" /> Gelir Projeksiyonu
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={incomeForecastData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }} />
                <YAxis
                  tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }}
                  tickFormatter={(v) => `₺${v.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value) => [`₺${Number(value).toLocaleString()}`, "Gelir Tahmini"]}
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    color: tooltipColor,
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Gelir Tahmini"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Expense Forecast */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <AlertCircle size={14} className="text-red-500" /> Gider Projeksiyonu
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={expenseForecastData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }} />
                <YAxis
                  tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }}
                  tickFormatter={(v) => `₺${v.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value) => [`₺${Number(value).toLocaleString()}`, "Gider Tahmini"]}
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    color: tooltipColor,
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Gider Tahmini"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 3: Cash Flow Forecast */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-primary" /> Gelecek Nakit Akışı
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowForecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }} />
                <YAxis
                  tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }}
                  tickFormatter={(v) => `₺${v.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `₺${Number(value).toLocaleString()}`,
                    name === "income" ? "Tahmini Gelir" : "Tahmini Gider",
                  ]}
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    color: tooltipColor,
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                <Bar dataKey="income" name="Tahmini Gelir" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Tahmini Gider" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 4: Portfolio Growth Forecast */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-primary" /> Portföy Büyüme Projeksiyonu
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={portfolioGrowthData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004ac6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#004ac6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }} />
                <YAxis
                  tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }}
                  tickFormatter={(v) => `₺${v.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value) => [
                    `₺${Number(value).toLocaleString()}`,
                    "Tahmini Portföy Değeri",
                  ]}
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    color: tooltipColor,
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Tahmini Portföy Değeri"
                  stroke="#004ac6"
                  fillOpacity={1}
                  fill="url(#colorGrowth)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
