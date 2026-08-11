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
import { clearChat } from "@/features/ai/aiSlice";
import toast from "react-hot-toast";

export const useIsDemoActive = () => {
  const dispatch = useAppDispatch();

  const { items: transactions = [] } = useAppSelector((state) => state.transactions || {});
  const { items: budgets = [] } = useAppSelector((state) => state.budget || {});
  const { assets = [] } = useAppSelector((state) => state.portfolio || {});
  const { items: goals = [] } = useAppSelector((state) => state.goals || {});
  const { items: subscriptions = [] } = useAppSelector((state) => state.subscriptions || {});
  const { logs: activities = [] } = useAppSelector((state) => state.activity || {});
  const { notifications = [] } = useAppSelector((state) => state.notifications || {});

  const user = useAppSelector((state) => state.auth?.user);

  // Dynamic counts based on actual EF Core DB / API entity flags (IsDemo == true)
  const demoCounts = useMemo(() => {
    const isDemoItem = (item: Record<string, unknown>) => Boolean(item.isDemo || item.IsDemo);

    const demoTrans = transactions.filter(isDemoItem).length;
    const demoBudgets = budgets.filter(isDemoItem).length;
    const demoAssets = assets.filter(isDemoItem).length;
    const demoGoals = goals.filter(isDemoItem).length;
    const demoSubs = subscriptions.filter(isDemoItem).length;
    const demoActs = activities.filter(isDemoItem).length;
    const demoNotifs = notifications.filter(isDemoItem).length;

    return {
      transactions: demoTrans,
      budgets: demoBudgets,
      portfolio: demoAssets,
      goals: demoGoals,
      subscriptions: demoSubs,
      activities: demoActs,
      notifications: demoNotifs,
      total: demoTrans + demoBudgets + demoAssets + demoGoals + demoSubs + demoActs + demoNotifs,
    };
  }, [transactions, budgets, assets, goals, subscriptions, activities, notifications]);

  // Single Source of Truth: Is Demo Mode active?
  const isDemoActive = useMemo(() => {
    const isStoredDemo = localStorage.getItem("is_demo_mode") === "true";
    const isDemoUser = user?.email?.toLowerCase() === "demo@financefocus.com";
    return isStoredDemo || isDemoUser;
  }, [user]);

  const exitDemoMode = useCallback(async () => {
    try {
      const res = await onboardingApi.clearDemoData();
      if (res.success) {
        localStorage.removeItem("is_demo_mode");
        toast.success("Demo modundan çıkıldı. Demo verileri temizlendi.");
        dispatch(clearChat());
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
    demoCounts,
    exitDemoMode,
  };
};

export default useIsDemoActive;
