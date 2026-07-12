import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectThemeMode } from "@/store/themeSlice";
import { fetchTransactions } from "@/features/transactions/transactionsSlice";
import { fetchBudgets } from "@/features/budget/budgetSlice";
import { fetchPortfolio } from "@/features/portfolio/portfolioSlice";
import { fetchGoals } from "@/features/goals/goalsSlice";
import { fetchSubscriptions } from "@/features/subscriptions/subscriptionsSlice";
import {
  generateIncomeReport,
  generateExpenseReport,
  calculateSavingsRate,
  calculateAverageMonthlySpending,
  calculateMostSpentCategory,
  calculateMostProfitableAsset,
  calculateCategoryExpenseDistribution,
  calculateIncomeExpenseTrend,
  calculateMonthlyCashFlow,
  calculatePortfolioAssetAllocation,
  calculateSubscriptionCategoryTotals,
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  subDays,
  subMonths,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  parseISO,
} from "date-fns";
import Button from "@/components/ui/Button";
import {
  FileSpreadsheet,
  FileText,
  FileDown,
  RotateCcw,
  TrendingUp,
  PieChart as PieIcon,
  BarChart2,
} from "lucide-react";
import ErrorState from "@/components/feedback/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";

const COLORS = [
  "#004ac6",
  "#16a34a",
  "#bc4800",
  "#505f76",
  "#8b5cf6",
  "#eab308",
  "#06b6d4",
  "#ec4899",
];

export const Reports: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);

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

  const {
    items: transactions,
    loading: transLoading,
    error: transError,
  } = useAppSelector((state) => state.transactions);
  const {
    items: budgets,
    loading: budgetsLoading,
    error: budgetsError,
  } = useAppSelector((state) => state.budget);
  const {
    assets,
    loading: portLoading,
    error: portError,
  } = useAppSelector((state) => state.portfolio);
  const { loading: goalsLoading, error: goalsError } = useAppSelector((state) => state.goals);
  const {
    items: subscriptions,
    loading: subsLoading,
    error: subsError,
  } = useAppSelector((state) => state.subscriptions);

  const [filterType, setFilterType] = useState<string>("30gun");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  const loadAllData = React.useCallback(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBudgets());
    dispatch(fetchPortfolio());
    dispatch(fetchGoals());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const dateRange = useMemo(() => {
    const today = new Date();
    switch (filterType) {
      case "bugun":
        return { start: startOfDay(today), end: endOfDay(today) };
      case "7gun":
        return { start: startOfDay(subDays(today, 6)), end: endOfDay(today) };
      case "30gun":
        return { start: startOfDay(subDays(today, 29)), end: endOfDay(today) };
      case "buAy":
        return { start: startOfMonth(today), end: endOfDay(today) };
      case "gecenAy":
        const prevMonth = subMonths(today, 1);
        return { start: startOfMonth(prevMonth), end: endOfMonth(prevMonth) };
      case "buYil":
        return { start: startOfYear(today), end: endOfDay(today) };
      case "ozel":
        if (customStart && customEnd) {
          return { start: startOfDay(parseISO(customStart)), end: endOfDay(parseISO(customEnd)) };
        }
        return { start: startOfMonth(today), end: endOfDay(today) };
      default:
        return { start: startOfDay(subDays(today, 29)), end: endOfDay(today) };
    }
  }, [filterType, customStart, customEnd]);

  const reportMetrics = useMemo(() => {
    const totalIncome = generateIncomeReport(transactions, dateRange.start, dateRange.end);
    const totalExpense = generateExpenseReport(transactions, dateRange.start, dateRange.end);
    const netSavings = totalIncome - totalExpense;
    const savingsRate = calculateSavingsRate(totalIncome, totalExpense);
    const avgSpending = calculateAverageMonthlySpending(transactions);

    const mostSpent = calculateMostSpentCategory(transactions, dateRange.start, dateRange.end);
    const mostProfitable = calculateMostProfitableAsset(assets);

    return {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      avgSpending,
      mostSpentCategory: mostSpent ? mostSpent.name : "Yok",
      mostSpentAmount: mostSpent ? mostSpent.amount : 0,
      mostProfitableAsset: mostProfitable ? mostProfitable.name : "Yok",
      mostProfitableValue: mostProfitable ? mostProfitable.profit : 0,
    };
  }, [transactions, assets, dateRange]);

  const trendData = useMemo(() => {
    return calculateIncomeExpenseTrend(transactions, dateRange.start, dateRange.end);
  }, [transactions, dateRange]);

  const expenseDistData = useMemo(() => {
    return calculateCategoryExpenseDistribution(transactions, dateRange.start, dateRange.end);
  }, [transactions, dateRange]);

  const cashFlowData = useMemo(() => {
    return calculateMonthlyCashFlow(transactions);
  }, [transactions]);

  const portfolioAllocation = useMemo(() => {
    return calculatePortfolioAssetAllocation(assets);
  }, [assets]);

  const budgetUsageData = useMemo(() => {
    return budgets.map((b) => ({
      name: b.category,
      Harcama: b.spentAmount,
      Limit: b.limitAmount,
    }));
  }, [budgets]);

  const subCostData = useMemo(() => {
    const mapped = subscriptions.map((s) => ({
      id: s.id,
      name: s.name,
      cost: s.cost,
      billingCycle: s.billingCycle,
      nextBillingDate: s.nextBillingDate,
      category: s.category,
    }));
    return calculateSubscriptionCategoryTotals(mapped);
  }, [subscriptions]);

  const handleExportCSV = () => {
    const filteredTxs = transactions.filter((t) => {
      const txDate = parseISO(t.date);
      return txDate >= dateRange.start && txDate <= dateRange.end;
    });

    if (filteredTxs.length === 0) {
      toast.error("Seçili tarih aralığında aktarılacak veri bulunamadı.");
      return;
    }

    const headers = "Tarih,Açıklama,Kategori,Tip,Tutar,Para Birimi\n";
    const rows = filteredTxs
      .map((t) => `${t.date},${t.category},${t.category},${t.transactionType},${t.amount},TRY`)
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Finansal_Rapor_${filterType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Rapor CSV olarak başarıyla dışa aktarıldı.");
  };

  const handleExportExcel = () => {
    handleExportCSV();
  };

  const handleExportPDF = () => {
    toast.success("Finansal Analiz Raporu PDF olarak yazdırılıyor...");
    window.print();
  };

  const loading = transLoading || budgetsLoading || portLoading || goalsLoading || subsLoading;
  const error = transError || budgetsError || portError || goalsError || subsError;

  if (loading) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left space-y-8 select-none">
        <div className="space-y-2">
          <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          ))}
        </div>
        <SkeletonTable columns={4} rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left py-12">
        <ErrorState
          title="Raporlar Yüklenemedi"
          description="Grafik ve analiz verileri mock sunucudan çekilirken bir problem yaşandı. Lütfen tekrar deneyiniz."
          onRetry={loadAllData}
          retryLabel="Yeniden Dene"
          retryIcon={<RotateCcw size={16} />}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 select-none">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Finansal Raporlar
          </h2>
          <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400 font-medium mt-1">
            Tüm modüllerin kümülatif harcama, yatırım, hedef ve bütçe analiz raporları.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<FileSpreadsheet size={16} />}
            onClick={handleExportExcel}
          >
            Excel İndir
          </Button>
          <Button variant="outline" icon={<FileDown size={16} />} onClick={handleExportCSV}>
            CSV Aktar
          </Button>
          <Button variant="primary" icon={<FileText size={16} />} onClick={handleExportPDF}>
            PDF Raporu
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-soft-sm select-none">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { value: "bugun", label: "Bugün" },
            { value: "7gun", label: "Son 7 Gün" },
            { value: "30gun", label: "Son 30 Gün" },
            { value: "buAy", label: "Bu Ay" },
            { value: "gecenAy", label: "Geçen Ay" },
            { value: "buYil", label: "Bu Yıl" },
            { value: "ozel", label: "Özel Aralık" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilterType(item.value)}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                filterType === item.value
                  ? "bg-primary text-white"
                  : "bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {filterType === "ozel" && (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-650 dark:text-slate-205 focus:outline-none focus:border-primary"
            />
            <span className="text-slate-400 font-bold text-xs">-</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-650 dark:text-slate-205 focus:outline-none focus:border-primary"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 select-none">
        {/* Toplam Gelir */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Toplam Gelir
          </span>
          <div className="text-base font-black text-emerald-600 dark:text-emerald-450 leading-none">
            {formatCurrency(reportMetrics.totalIncome, "TRY")}
          </div>
          <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block mt-2">
            Seçili dönem
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Toplam Gider
          </span>
          <div className="text-base font-black text-red-500 dark:text-red-400 leading-none">
            {formatCurrency(reportMetrics.totalExpense, "TRY")}
          </div>
          <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block mt-2">
            Seçili dönem
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Net Tasarruf
          </span>
          <div className="text-base font-black text-slate-850 dark:text-white leading-none">
            {formatCurrency(reportMetrics.netSavings, "TRY")}
          </div>
          <span className="text-[9px] font-black text-emerald-600 mt-2 block">
            %{reportMetrics.savingsRate} Tasarruf Oranı
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Ort. Aylık Harcama
          </span>
          <div className="text-base font-black text-slate-850 dark:text-white leading-none">
            {formatCurrency(reportMetrics.avgSpending, "TRY")}
          </div>
          <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 block mt-2">
            Tüm dönemler ortalaması
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            En Çok Harcanan
          </span>
          <div
            className="text-sm font-black text-slate-850 dark:text-white leading-none overflow-hidden text-ellipsis whitespace-nowrap"
            title={reportMetrics.mostSpentCategory}
          >
            {reportMetrics.mostSpentCategory}
          </div>
          <span className="text-[9px] font-bold text-red-650 mt-2 block">
            {formatCurrency(reportMetrics.mostSpentAmount, "TRY")}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-soft-sm">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            En Çok Kazandıran
          </span>
          <div
            className="text-sm font-black text-slate-850 dark:text-white leading-none overflow-hidden text-ellipsis whitespace-nowrap"
            title={reportMetrics.mostProfitableAsset}
          >
            {reportMetrics.mostProfitableAsset}
          </div>
          <span className="text-[9px] font-bold text-emerald-600 mt-2 block">
            {formatCurrency(reportMetrics.mostProfitableValue, "TRY")} kâr
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter select-none">
        {/* Graph 1: Income vs Expense Trend */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-primary" /> Gelir vs Gider Eğilimi
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }} />
                <YAxis
                  tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }}
                  tickFormatter={(v) => `₺${v.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `₺${Number(value).toLocaleString()}`,
                    name === "income" ? "Gelir" : "Gider",
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
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Gelir"
                  stroke="#16a34a"
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Gider"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <PieIcon size={14} className="text-primary" /> Harcama Kategori Dağılımı
          </h3>
          <div className="w-full h-64 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseDistData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`₺${Number(value).toLocaleString()}`, "Toplam Tutar"]}
                    contentStyle={{
                      background: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      color: tooltipColor,
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 space-y-2 max-h-56 overflow-y-auto">
              {expenseDistData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-slate-650 dark:text-slate-350">{item.name}</span>
                  </div>
                  <span className="text-slate-855 dark:text-slate-205">
                    {formatCurrency(item.value, "TRY")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <BarChart2 size={14} className="text-primary" /> Aylık Nakit Akışı
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }} />
                <YAxis
                  tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }}
                  tickFormatter={(v) => `₺${v.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `₺${Number(value).toLocaleString()}`,
                    name === "income" ? "Gelir" : "Gider",
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
                <Bar dataKey="income" name="Gelir" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Gider" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-primary" /> Portföy Varlık Dağılımı (₺)
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={portfolioAllocation}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  type="number"
                  tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }}
                  tickFormatter={(v) => `₺${v.toLocaleString()}`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }}
                  width={70}
                />
                <Tooltip
                  formatter={(value) => [`₺${Number(value).toLocaleString()}`, "Varlık Değeri"]}
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    color: tooltipColor,
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                />
                <Bar dataKey="value" name="Varlık Değeri" fill="#004ac6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <BarChart2 size={14} className="text-primary" /> Bütçe Limit vs Harcama Dağılımı
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }} />
                <YAxis
                  tick={{ fill: textColor, fontSize: 9, fontWeight: 700 }}
                  tickFormatter={(v) => `₺${v.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value, name) => [`₺${Number(value).toLocaleString()}`, name]}
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    color: tooltipColor,
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                <Bar dataKey="Limit" name="Limit" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Harcama" name="Harcanan" fill="#004ac6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <PieIcon size={14} className="text-primary" /> Aylık Abonelik Kategori Maliyetleri
          </h3>
          <div className="w-full h-64 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subCostData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {subCostData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`₺${Number(value).toLocaleString()}`, "Aylık Gider"]}
                    contentStyle={{
                      background: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      color: tooltipColor,
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 space-y-2 max-h-56 overflow-y-auto">
              {subCostData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-slate-650 dark:text-slate-350">{item.name}</span>
                  </div>
                  <span className="text-slate-855 dark:text-slate-205">
                    {formatCurrency(item.value, "TRY")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
