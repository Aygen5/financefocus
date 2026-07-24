import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchDashboardData,
  selectDashboardData,
  selectDashboardLoading,
  selectDashboardError,
} from "@/features/dashboard/dashboardSlice";
import onboardingApi from "@/api/onboardingApi";
import SummaryCards from "@/features/dashboard/components/SummaryCards";
import CashFlowAnalysis from "@/features/dashboard/components/CashFlowAnalysis";
import RecentTransactions from "@/features/dashboard/components/RecentTransactions";
import FinancialHealthScore from "@/features/dashboard/components/FinancialHealthScore";
import ActiveGoals from "@/features/dashboard/components/ActiveGoals";
import UpcomingRenewals from "@/features/dashboard/components/UpcomingRenewals";
import QuickActions from "@/features/dashboard/components/QuickActions";
import OnboardingCard from "@/features/dashboard/components/OnboardingCard";
import { SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";
import ErrorState from "@/components/feedback/ErrorState";
import toast from "react-hot-toast";
import { RotateCcw, AlertCircle } from "lucide-react";
import type { Subscription } from "@/features/subscriptions/subscriptionsSlice";
import type { Goal } from "@/features/goals/goalsSlice";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth || {});
  const dashboardData = useAppSelector(selectDashboardData);
  const dashboardLoading = useAppSelector(selectDashboardLoading);
  const dashboardError = useAppSelector(selectDashboardError);

  const loadDashboardData = React.useCallback(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const summary = dashboardData?.summary;

  const recentTransactionsMapped = useMemo(() => {
    if (!dashboardData?.recentTransactions) return [];
    return dashboardData.recentTransactions.map((t) => ({
      id: t.id,
      userId: t.userId,
      amount: t.amount,
      transactionType: String(t.transactionType).toLowerCase() === "income" ? "income" : "expense",
      category: t.category,
      paymentMethod: t.paymentMethod,
      date: t.transactionDate || new Date().toISOString(),
      description: t.description,
      account: t.account,
      currency: "TRY",
    }));
  }, [dashboardData]);

  const goalsMapped = useMemo((): Goal[] => {
    if (!dashboardData?.goals) return [];
    return dashboardData.goals.map((g) => ({
      id: g.id,
      userId: g.userId,
      name: g.name,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      category: g.category,
      deadline: g.deadline,
    }));
  }, [dashboardData]);

  const subscriptionsMapped = useMemo((): Subscription[] => {
    if (!dashboardData?.subscriptions?.upcomingRenewals) return [];
    return dashboardData.subscriptions.upcomingRenewals.map((s) => ({
      id: s.id,
      userId: s.userId,
      name: s.name,
      price: s.price,
      cost: s.price,
      billingCycle: s.billingCycle,
      nextBillingDate: s.nextBillingDate,
      category: s.category,
      isActive: s.isActive,
    }));
  }, [dashboardData]);

  const displayName = user?.firstName || user?.email?.split("@")[0] || "Kullanıcı";

  const handleTransfer = () => {
    toast.success("Transfer işlemi başlatıldı.");
  };

  const handleExport = () => {
    window.print();
  };

  const handleSeedDemoData = async () => {
    try {
      const res = await onboardingApi.seedDemoData();
      if (res.success) {
        toast.success(res.message || "Demo verileri başarıyla oluşturuldu!");
        loadDashboardData();
      } else {
        toast.error(res.message || "Demo verileri oluşturulamadı.");
      }
    } catch {
      toast.error("Demo verileri yüklenirken bir hata oluştu.");
    }
  };

  if (dashboardLoading && !dashboardData) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left space-y-gutter select-none">
        <div className="space-y-2">
          <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard hasAvatar={false} lines={1} className="h-32" />
          <SkeletonCard hasAvatar={false} lines={1} className="h-32" />
          <SkeletonCard hasAvatar={false} lines={1} className="h-32" />
          <SkeletonCard hasAvatar={false} lines={1} className="h-32" />
        </div>

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

  if (
    summary &&
    summary.monthlyIncome === 0 &&
    summary.monthlyExpense === 0 &&
    summary.portfolioCurrentValue === 0
  ) {
    return <OnboardingCard onSeedDemoData={handleSeedDemoData} />;
  }

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      <div className="mb-stack-lg select-none">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 tracking-tight">
          Hoş geldiniz, {displayName}.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant font-medium">
          Finansal sağlığınız güçlü görünüyor. İşte mevcut durumunuzun özeti.
        </p>
      </div>

      <SummaryCards
        netWorth={summary?.portfolioCurrentValue || 624400}
        income={summary?.monthlyIncome || 120000}
        expenses={summary?.monthlyExpense || 60998}
        savings={summary?.netSavings || 59002}
        loading={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 flex flex-col gap-gutter">
          <CashFlowAnalysis data={summary?.cashFlowHistory || []} loading={false} />

          <RecentTransactions
            transactions={
              recentTransactionsMapped as unknown as Parameters<
                typeof RecentTransactions
              >[0]["transactions"]
            }
            loading={false}
          />
        </div>

        <div className="flex flex-col gap-gutter">
          <FinancialHealthScore score={summary?.financialHealthScore || 90} loading={false} />

          <ActiveGoals goals={goalsMapped.slice(0, 2)} loading={false} />

          <UpcomingRenewals subscriptions={subscriptionsMapped.slice(0, 2)} loading={false} />

          <QuickActions onTransfer={handleTransfer} onExport={handleExport} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
