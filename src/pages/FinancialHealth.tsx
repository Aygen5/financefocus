import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTransactions } from "@/features/transactions/transactionsSlice";
import { fetchBudgets } from "@/features/budget/budgetSlice";
import { fetchPortfolio } from "@/features/portfolio/portfolioSlice";
import { fetchGoals } from "@/features/goals/goalsSlice";
import { fetchSubscriptions } from "@/features/subscriptions/subscriptionsSlice";
import { selectFinancialHealthData } from "@/features/financialHealth/selectors";
import { getHealthStatus } from "@/utils/financialHealth";
import { formatCurrency } from "@/utils/financial";
import { RefreshCw, Activity, Sparkles } from "lucide-react";
import ErrorState from "@/components/feedback/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { addActivityLog } from "@/features/activity/activitySlice";
import { addNotification } from "@/features/notifications/notificationsSlice";
import toast from "react-hot-toast";

export const FinancialHealth: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux States
  const { loading: transLoading = false, error: transError = null } = useAppSelector(
    (state) => state.transactions || {},
  );
  const { loading: budgetsLoading = false, error: budgetsError = null } = useAppSelector(
    (state) => state.budget || {},
  );
  const { loading: portLoading = false, error: portError = null } = useAppSelector(
    (state) => state.portfolio || {},
  );
  const { loading: goalsLoading = false, error: goalsError = null } = useAppSelector(
    (state) => state.goals || {},
  );
  const { loading: subsLoading = false, error: subsError = null } = useAppSelector(
    (state) => state.subscriptions || {},
  );

  const loading = transLoading || budgetsLoading || portLoading || goalsLoading || subsLoading;
  const error = transError || budgetsError || portError || goalsError || subsError;

  // Dynamic calculated health dataset using Redux Selector
  const healthData = useAppSelector(selectFinancialHealthData);

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

  // Dispatch health warning notification once score is calculated
  useEffect(() => {
    if (!loading && healthData.overallScore > 0) {
      const isDropped = healthData.overallScore < 75;
      dispatch(
        addActivityLog({
          action: "Financial Health Status Check",
          category: "FinanceHealth",
          description: isDropped
            ? `Finansal sağlık puanı düştü! Güncel Skor: ${healthData.overallScore}.`
            : `Finansal sağlık puanınız stabil. Güncel Skor: ${healthData.overallScore}.`,
          user: "Aygen",
          icon: "Activity",
          status: isDropped ? "warning" : "success",
        }),
      );
      dispatch(
        addNotification({
          title: "Financial Health düştü",
          message: isDropped
            ? `Finansal sağlık puanınız ${healthData.overallScore} seviyesine geriledi! Önerileri inceleyin.`
            : `Finansal sağlık puanınız ${healthData.overallScore} (Stabil). Harika gidiyorsunuz!`,
          type: isDropped ? "warning" : "success",
          icon: "Activity",
        }),
      );
    }
  }, [loading, healthData.overallScore, dispatch]);

  // AI-like dynamic warnings list
  const insights = useMemo(() => {
    const list: string[] = [];

    if (healthData.subscriptionLoad > 7) {
      list.push("Monthly subscriptions are higher than recommended.");
    }
    if (healthData.savingsRate >= 25) {
      list.push("Your savings rate is excellent.");
    } else {
      list.push("Try to increase your savings rate to at least 20%.");
    }
    if (healthData.incomeExpenseRatio >= 75) {
      list.push("Reduce dining and leisure expenses to balance your income/expense ratio.");
    }
    if (healthData.emergencyFundProgress < 50) {
      list.push("Emergency fund should cover at least 6 months of living expenses.");
    } else {
      list.push("Your emergency fund safety buffer looks solid.");
    }
    if (healthData.budgetUsage > 100) {
      list.push("Alert: Categorized budget limits have been breached.");
    }

    return list;
  }, [healthData]);

  const handleRecalculate = () => {
    loadAllData();
    toast.success("Skor başarıyla güncellendi!");
  };

  const status = getHealthStatus(healthData.overallScore);

  // Circular progress dimensions
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthData.overallScore / 100) * circumference;

  // Render loading state
  if (loading) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left space-y-8 select-none">
        <div className="space-y-2">
          <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <SkeletonTable columns={4} rows={6} />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left py-12">
        <ErrorState
          title="Finansal Sağlık Analizi Yüklenemedi"
          description="Finansal sağlık metrikleri mock sunucudan çekilirken bir problem yaşandı. Lütfen tekrar deneyiniz."
          onRetry={loadAllData}
          retryLabel="Yeniden Dene"
          retryIcon={<RefreshCw size={16} />}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 select-none">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Finansal Sağlık Analizi
          </h2>
          <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400 font-medium mt-1">
            Gelir dengesi, birikim, yatırımlar ve bütçe disiplin analizinizin dinamik
            değerlendirmesi.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold select-none">
          <span className="text-slate-400 dark:text-slate-500 font-bold">
            Değerlendirme: Canlı Veri
          </span>
          <button
            onClick={handleRecalculate}
            className="text-primary dark:text-brand-400 font-black flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RefreshCw size={14} /> Yeniden Değerlendir
          </button>
        </div>
      </div>

      {/* Main Circular progress and Stats Cards Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-8 select-none">
        {/* Left Side: Circular Score (5 Columns) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-soft-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">
            Overall Health Score
          </h3>

          {/* SVG Circular Progress */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke={status.fill}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-850 dark:text-white leading-none">
                {healthData.overallScore}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
                / 100
              </span>
            </div>
          </div>

          <div className="mt-6">
            <span
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold capitalize ${status.color} ${status.bg} border border-slate-200/30`}
            >
              {status.label}
            </span>
          </div>

          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-5 leading-relaxed max-w-xs">
            Skorunuz 5 farklı temel finansal disiplin analizinin ağırlıklı ortalamasıyla reaktif
            hesaplanır.
          </p>
        </div>

        {/* Right Side: 6 Metric Cards (7 Columns) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Savings Rate */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Savings Rate
              </span>
              <div className="text-lg font-black text-slate-850 dark:text-white leading-none">
                %{healthData.savingsRate}
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Score: {healthData.savingsRateScore}/100
            </div>
          </div>

          {/* Card 2: Debt Ratio */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Debt Ratio
              </span>
              <div className="text-lg font-black text-slate-855 dark:text-white leading-none">
                %{healthData.debtRatio}
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Score: {healthData.debtRatioScore}/100
            </div>
          </div>

          {/* Card 3: Monthly Burn Rate */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Monthly Burn Rate
              </span>
              <div className="text-sm font-black text-slate-855 dark:text-white leading-none">
                {formatCurrency(healthData.monthlyBurnRate, "TRY")}
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Score: {healthData.burnRateScore}/100
            </div>
          </div>

          {/* Card 4: Emergency Fund */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Emergency Fund
              </span>
              <div className="text-lg font-black text-slate-855 dark:text-white leading-none">
                %{healthData.emergencyFundProgress}
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Score: {healthData.emergencyFundScore}/100
            </div>
          </div>

          {/* Card 5: Investment Ratio */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Investment Ratio
              </span>
              <div className="text-lg font-black text-slate-855 dark:text-white leading-none">
                %{healthData.investmentRatio}
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Score: {healthData.investmentRatioScore}/100
            </div>
          </div>

          {/* Card 6: Budget Discipline */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Budget Discipline
              </span>
              <div className="text-lg font-black text-slate-855 dark:text-white leading-none">
                %{healthData.budgetUsage}
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Score: {healthData.budgetDisciplineScore}/100
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Insights Board */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-soft-sm select-none">
        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Sparkles size={14} className="text-primary" /> Yapay Zeka Finansal Tavsiyeleri (AI
          Insights)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-start gap-2.5 text-xs font-bold leading-relaxed text-slate-750 dark:text-slate-350"
            >
              <Activity size={16} className="text-primary shrink-0 mt-0.5" />
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialHealth;
