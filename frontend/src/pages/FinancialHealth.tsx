import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTransactions } from "@/features/transactions/transactionsSlice";
import { fetchBudgets } from "@/features/budget/budgetSlice";
import { fetchPortfolio } from "@/features/portfolio/portfolioSlice";
import { fetchGoals } from "@/features/goals/goalsSlice";
import { fetchSubscriptions } from "@/features/subscriptions/subscriptionsSlice";
import { fetchFinancialHealth } from "@/features/financialHealth/financialHealthSlice";
import { RefreshCw, Activity, Sparkles } from "lucide-react";
import ErrorState from "@/components/feedback/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";

export const FinancialHealth: React.FC = () => {
  const dispatch = useAppDispatch();

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
  const {
    healthData,
    loading: healthLoading = false,
    error: healthError = null,
  } = useAppSelector((state) => state.financialHealth || {});

  const loading =
    transLoading || budgetsLoading || portLoading || goalsLoading || subsLoading || healthLoading;
  const error = transError || budgetsError || portError || goalsError || subsError || healthError;

  const loadAllData = React.useCallback(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBudgets());
    dispatch(fetchPortfolio());
    dispatch(fetchGoals());
    dispatch(fetchSubscriptions());
    dispatch(fetchFinancialHealth());
  }, [dispatch]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const score = healthData?.financialHealthScore ?? 0;
  const breakdown = healthData?.scoreBreakdown;
  const insights = healthData?.insights || [];

  const handleRecalculate = () => {
    loadAllData();
    toast.success("Skor başarıyla güncellendi!");
  };

  const getStatusConfig = (s: number) => {
    if (s >= 80)
      return {
        label: "Mükemmel",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        fill: "#10b981",
      };
    if (s >= 60)
      return { label: "İyi", color: "text-blue-500", bg: "bg-blue-500/10", fill: "#3b82f6" };
    if (s >= 40)
      return {
        label: "Orta / Dikkat",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        fill: "#f59e0b",
      };
    return { label: "Kritik", color: "text-red-500", bg: "bg-red-500/10", fill: "#ef4444" };
  };

  const status = getStatusConfig(score);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

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

  if (error) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left py-12">
        <ErrorState
          title="Finansal Sağlık Analizi Yüklenemedi"
          description="Finansal sağlık metrikleri alınırken bir problem yaşandı. Lütfen internet bağlantınızı kontrol ediniz."
          onRetry={loadAllData}
          retryLabel="Yeniden Dene"
          retryIcon={<RefreshCw size={16} />}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-8 select-none">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-soft-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">
            Genel Sağlık Skoru
          </h3>

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
                {score}
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

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Gelir / Gider Dengesi
              </span>
              <div className="text-lg font-black text-slate-850 dark:text-white leading-none">
                {breakdown?.incomeExpenseScore?.toFixed(1) || 0} / 25
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Ağırlık: %25
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Bütçe Uyum Puanı
              </span>
              <div className="text-lg font-black text-slate-855 dark:text-white leading-none">
                {breakdown?.budgetAdherenceScore?.toFixed(1) || 0} / 20
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Ağırlık: %20
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Tasarruf Oranı
              </span>
              <div className="text-sm font-black text-slate-855 dark:text-white leading-none">
                {breakdown?.savingsRateScore?.toFixed(1) || 0} / 20
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Ağırlık: %20
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Hedef İlerlemesi
              </span>
              <div className="text-lg font-black text-slate-855 dark:text-white leading-none">
                {breakdown?.goalProgressScore?.toFixed(1) || 0} / 15
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Ağırlık: %15
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Portföy Büyüklüğü
              </span>
              <div className="text-lg font-black text-slate-855 dark:text-white leading-none">
                {breakdown?.portfolioSizeScore?.toFixed(1) || 0} / 10
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Ağırlık: %10
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Abonelik Yükü
              </span>
              <div className="text-lg font-black text-slate-855 dark:text-white leading-none">
                {breakdown?.subscriptionOverheadScore?.toFixed(1) || 0} / 10
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Ağırlık: %10
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-soft-sm select-none">
        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Sparkles size={14} className="text-primary" /> Yapay Zeka Finansal Tavsiyeleri (AI
          Insights)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.length === 0 ? (
            <p className="text-xs text-slate-400 font-bold col-span-2">
              Finansal verileriniz analiz edilerek yapay zeka tavsiyeleri oluşturulmaktadır.
            </p>
          ) : (
            insights.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-start gap-2.5 text-xs font-bold leading-relaxed text-slate-750 dark:text-slate-350"
              >
                <Activity size={16} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-extrabold text-slate-855 dark:text-white">{item.title}</h5>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    {item.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialHealth;
