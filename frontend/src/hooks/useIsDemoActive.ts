import { useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import onboardingApi from "@/api/onboardingApi";
import { fetchDashboardData } from "@/features/dashboard/dashboardSlice";
import { fetchTransactions } from "@/features/transactions/transactionsSlice";
import { fetchBudgets } from "@/features/budget/budgetSlice";
import { fetchPortfolio } from "@/features/portfolio/portfolioSlice";
import { fetchGoals } from "@/features/goals/goalsSlice";
import { fetchSubscriptions } from "@/features/subscriptions/subscriptionsSlice";
import { fetchFinancialHealth } from "@/features/financialHealth/financialHealthSlice";
import { fetchActivities } from "@/features/activity/activitySlice";
import { fetchNotifications } from "@/features/notifications/notificationsSlice";
import toast from "react-hot-toast";

export const useIsDemoActive = () => {
  const dispatch = useAppDispatch();

  const { items: transactions = [] } = useAppSelector((state) => state.transactions || {});
  const { items: budgets = [] } = useAppSelector((state) => state.budget || {});
  const { assets = [] } = useAppSelector((state) => state.portfolio || {});
  const { items: goals = [] } = useAppSelector((state) => state.goals || {});
  const { items: subscriptions = [] } = useAppSelector((state) => state.subscriptions || {});

  const isDemoActive = useMemo(() => {
    const isStoredDemo = localStorage.getItem("is_demo_mode") === "true";
    const hasDemoTrans = transactions.some((t: Record<string, unknown>) =>
      Boolean(t.isDemo || t.IsDemo),
    );
    const hasDemoBudget = budgets.some((b: Record<string, unknown>) =>
      Boolean(b.isDemo || b.IsDemo),
    );
    const hasDemoAsset = assets.some((a: Record<string, unknown>) => Boolean(a.isDemo || a.IsDemo));
    const hasDemoGoal = goals.some((g: Record<string, unknown>) => Boolean(g.isDemo || g.IsDemo));
    const hasDemoSub = subscriptions.some((s: Record<string, unknown>) =>
      Boolean(s.isDemo || s.IsDemo),
    );

    return (
      isStoredDemo || hasDemoTrans || hasDemoBudget || hasDemoAsset || hasDemoGoal || hasDemoSub
    );
  }, [transactions, budgets, assets, goals, subscriptions]);

  const exitDemoMode = useCallback(async () => {
    try {
      const res = await onboardingApi.clearDemoData();
      if (res.success) {
        localStorage.removeItem("is_demo_mode");
        toast.success("Demo modundan çıkıldı. Demo verileri temizlendi.");
        dispatch(fetchDashboardData());
        dispatch(fetchTransactions());
        dispatch(fetchBudgets());
        dispatch(fetchPortfolio());
        dispatch(fetchGoals());
        dispatch(fetchSubscriptions());
        dispatch(fetchFinancialHealth());
        dispatch(fetchActivities());
        dispatch(fetchNotifications());
      } else {
        toast.error(res.message || "Demo verileri temizlenirken hata oluştu.");
      }
    } catch {
      toast.error("Demo verileri temizlenirken hata oluştu.");
    }
  }, [dispatch]);

  return {
    isDemoActive,
    exitDemoMode,
  };
};

export default useIsDemoActive;
