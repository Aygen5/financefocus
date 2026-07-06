import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTransactions } from "@/features/transactions/transactionsSlice";
import { fetchGoals } from "@/features/goals/goalsSlice";
import { fetchSubscriptions } from "@/features/subscriptions/subscriptionsSlice";
import { fetchPortfolio } from "@/features/portfolio/portfolioSlice";
import { fetchBudgets } from "@/features/budget/budgetSlice";
import {
  calculateNetWorth,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  calculateMonthlyCashFlow,
  calculateFinancialHealthScore,
} from "@/utils/financial";
import SummaryCards from "@/features/dashboard/components/SummaryCards";
import CashFlowAnalysis from "@/features/dashboard/components/CashFlowAnalysis";
import RecentTransactions from "@/features/dashboard/components/RecentTransactions";
import FinancialHealthScore from "@/features/dashboard/components/FinancialHealthScore";
import ActiveGoals from "@/features/dashboard/components/ActiveGoals";
import UpcomingRenewals from "@/features/dashboard/components/UpcomingRenewals";
import QuickActions from "@/features/dashboard/components/QuickActions";
import { SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import ErrorState from "@/components/feedback/ErrorState";
import EmptyState from "@/components/feedback/EmptyState";
import toast from "react-hot-toast";
import { RotateCcw, AlertCircle } from "lucide-react";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux Slices
  const { user } = useAppSelector((state) => state.auth || {});
  const {
    items: transactions = [],
    loading: transLoading = false,
    error: transError = null,
  } = useAppSelector((state) => state.transactions || {});
  const {
    items: goals = [],
    loading: goalsLoading = false,
    error: goalsError = null,
  } = useAppSelector((state) => state.goals || {});
  const {
    items: subscriptions = [],
    loading: subsLoading = false,
    error: subsError = null,
  } = useAppSelector((state) => state.subscriptions || {});
  const {
    assets = [],
    loading: portLoading = false,
    error: portError = null,
  } = useAppSelector((state) => state.portfolio || {});
  const {
    items: budgets = [],
    loading: budgetsLoading = false,
    error: budgetsError = null,
  } = useAppSelector((state) => state.budget || {});

  // Verileri çek
  const loadDashboardData = React.useCallback(() => {
    dispatch(fetchTransactions());
    dispatch(fetchGoals());
    dispatch(fetchSubscriptions());
    dispatch(fetchPortfolio());
    dispatch(fetchBudgets());
  }, [dispatch]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Finansal hesaplamaların useMemo ile optimize edilmesi
  const totalIncome = useMemo(() => calculateTotalIncome(transactions), [transactions]);
  const totalExpenses = useMemo(() => calculateTotalExpenses(transactions), [transactions]);
  const netWorth = useMemo(() => calculateNetWorth(assets), [assets]);
  const netBalance = useMemo(
    () => calculateNetBalance(totalIncome, totalExpenses),
    [totalIncome, totalExpenses],
  );

  // İşlemler listesinden dinamik aylık nakit akışı verisi
  const cashFlowData = useMemo(() => calculateMonthlyCashFlow(transactions), [transactions]);

  // Reaktif Genel Finansal Sağlık Skoru
  const healthScore = useMemo(() => {
    const scores = calculateFinancialHealthScore(
      transactions,
      budgets,
      assets,
      goals,
      subscriptions,
    );
    return scores.overall;
  }, [transactions, budgets, assets, goals, subscriptions]);

  const displayName = user?.name || "Aygen";

  const handleTransfer = () => {
    toast.success("Transfer işlemi başlatıldı.");
  };

  const handleExport = () => {
    window.print();
  };

  const dashboardLoading =
    transLoading || goalsLoading || subsLoading || portLoading || budgetsLoading;
  const dashboardError = transError || goalsError || subsError || portError || budgetsError;

  // Render Loading Skeleton
  if (dashboardLoading) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left space-y-gutter select-none">
        {/* Karşılama Maskesi */}
        <div className="space-y-2">
          <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
        </div>

        {/* 4 Adet Summary Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard hasAvatar={false} lines={1} className="h-32" />
          <SkeletonCard hasAvatar={false} lines={1} className="h-32" />
          <SkeletonCard hasAvatar={false} lines={1} className="h-32" />
          <SkeletonCard hasAvatar={false} lines={1} className="h-32" />
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <div className="lg:col-span-2 space-y-gutter">
            <SkeletonCard hasAvatar={false} lines={3} className="h-[300px]" />
            <SkeletonTable columns={4} rows={3} />
          </div>
          <div className="space-y-gutter">
            <SkeletonCard hasAvatar={false} lines={2} className="h-40" />
            <SkeletonCard hasAvatar={false} lines={2} className="h-40" />
            <SkeletonCard hasAvatar={false} lines={2} className="h-40" />
          </div>
        </div>
      </div>
    );
  }

  // Render Error State
  if (dashboardError) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left py-12">
        <ErrorState
          title="Veri Yükleme Hatası"
          description="Dashboard verileri alınırken sunucu ile bağlantı kurulamadı. Lütfen internetinizi kontrol edip tekrar deneyiniz."
          icon={<AlertCircle size={24} />}
          onRetry={loadDashboardData}
          retryLabel="Yeniden Dene"
          retryIcon={<RotateCcw size={16} />}
        />
      </div>
    );
  }

  // Render Empty State (Hiç veri yoksa)
  if (transactions.length === 0 && assets.length === 0 && goals.length === 0) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left py-12">
        <EmptyState
          title="Finansal Kayıt Bulunamadı"
          description="Sistemde henüz hesap veya işlem kaydı bulunmamaktadır. İlk finansal hareketlerinizi Transactions sayfasından ekleyebilirsiniz."
          primaryActionLabel="Transactions Sayfasına Git"
          onPrimaryActionClick={loadDashboardData}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Karşılama Alanı */}
      <div className="mb-stack-lg select-none">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 tracking-tight">
          Günaydın, {displayName}.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant font-medium">
          Finansal sağlığınız güçlü görünüyor. İşte mevcut durumunuzun özeti.
        </p>
      </div>

      {/* Finansal Özet Kartları */}
      <SummaryCards
        netWorth={netWorth}
        income={totalIncome}
        expenses={totalExpenses}
        savings={netBalance > 0 ? netBalance : 0}
        loading={false}
      />

      {/* Bento Grid Yapısı */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Sol Kolon (Geniş) */}
        <div className="lg:col-span-2 flex flex-col gap-gutter">
          {/* Nakit Akış Grafiği */}
          <CashFlowAnalysis data={cashFlowData} loading={false} />

          {/* Son İşlemler Tablosu */}
          <RecentTransactions transactions={transactions.slice(0, 3)} loading={false} />
        </div>

        {/* Outer column (Right) */}
        <div className="flex flex-col gap-gutter">
          {/* Finansal Sağlık Skoru */}
          <FinancialHealthScore score={healthScore} loading={false} />

          {/* Aktif Hedefler */}
          <ActiveGoals goals={goals.slice(0, 2)} loading={false} />

          {/* Yaklaşan Abonelik Yenilemeleri */}
          <UpcomingRenewals subscriptions={subscriptions.slice(0, 2)} loading={false} />

          {/* Hızlı Aksiyonlar */}
          <QuickActions onTransfer={handleTransfer} onExport={handleExport} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
