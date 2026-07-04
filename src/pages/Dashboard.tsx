import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTransactions } from "@/features/transactions/transactionsSlice";
import { fetchGoals } from "@/features/goals/goalsSlice";
import { fetchSubscriptions } from "@/features/subscriptions/subscriptionsSlice";
import { fetchPortfolio } from "@/features/portfolio/portfolioSlice";
import { calculateNetWorth, calculateTotalIncome, calculateTotalExpenses } from "@/utils/financial";
import SummaryCards from "@/features/dashboard/components/SummaryCards";
import CashFlowAnalysis from "@/features/dashboard/components/CashFlowAnalysis";
import RecentTransactions from "@/features/dashboard/components/RecentTransactions";
import FinancialHealthScore from "@/features/dashboard/components/FinancialHealthScore";
import ActiveGoals from "@/features/dashboard/components/ActiveGoals";
import UpcomingRenewals from "@/features/dashboard/components/UpcomingRenewals";
import QuickActions from "@/features/dashboard/components/QuickActions";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux Slices
  const { user } = useAppSelector((state) => state.auth);
  const { items: transactions, loading: transLoading } = useAppSelector(
    (state) => state.transactions,
  );
  const { items: goals, loading: goalsLoading } = useAppSelector((state) => state.goals);
  const { items: subscriptions, loading: subsLoading } = useAppSelector(
    (state) => state.subscriptions,
  );
  const { assets, loading: portLoading } = useAppSelector((state) => state.portfolio);

  // Verileri çek
  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchGoals());
    dispatch(fetchSubscriptions());
    dispatch(fetchPortfolio());
  }, [dispatch]);

  // Finansal hesaplamalar (izole yardımcı fonksiyonlardan)
  const netWorth = calculateNetWorth(assets);
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const totalSavings = Math.max(totalIncome - totalExpenses, 0);

  // Mock Cash Flow Verisi (Grafik için)
  const cashFlowData = [
    { month: "Oca", income: 5000, expense: 3200 },
    { month: "Şub", income: 5200, expense: 3800 },
    { month: "Mar", income: 6000, expense: 4100 },
    { month: "Nis", income: 5800, expense: 3500 },
    { month: "May", income: 7200, expense: 4800 },
    { month: "Haz", income: 8000, expense: 5200 },
    { month: "Tem", income: totalIncome || 8200, expense: totalExpenses || 3450 },
  ];

  const displayName = user?.name || "Alex";

  const handleTransfer = () => {
    toast.success("Transfer işlemi başlatıldı.");
  };

  const handleExport = () => {
    toast.success("Finansal rapor PDF olarak dışa aktarılıyor.");
  };

  const dashboardLoading = transLoading || goalsLoading || subsLoading || portLoading;

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Karşılama Alanı */}
      <div className="mb-stack-lg">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 tracking-tight">
          Günaydın, {displayName}.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Finansal sağlığınız güçlü görünüyor. İşte mevcut durumunuzun özeti.
        </p>
      </div>

      {/* Finansal Özet Kartları */}
      <SummaryCards
        netWorth={netWorth || 124500}
        income={totalIncome || 8200}
        expenses={totalExpenses || 3450}
        savings={totalSavings || 4750}
        loading={dashboardLoading}
      />

      {/* Bento Grid Yapısı */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Sol Kolon (Geniş) */}
        <div className="lg:col-span-2 flex flex-col gap-gutter">
          {/* Nakit Akış Grafiği */}
          <CashFlowAnalysis data={cashFlowData} loading={dashboardLoading} />

          {/* Son İşlemler Tablosu */}
          <RecentTransactions transactions={transactions.slice(0, 3)} loading={dashboardLoading} />
        </div>

        {/* Sağ Kolon (Dar) */}
        <div className="flex flex-col gap-gutter">
          {/* Finansal Sağlık Skoru */}
          <FinancialHealthScore score={82} loading={dashboardLoading} />

          {/* Aktif Hedefler */}
          <ActiveGoals goals={goals.slice(0, 2)} loading={dashboardLoading} />

          {/* Yaklaşan Abonelik Yenilemeleri */}
          <UpcomingRenewals subscriptions={subscriptions.slice(0, 2)} loading={dashboardLoading} />

          {/* Hızlı Aksiyonlar */}
          <QuickActions onTransfer={handleTransfer} onExport={handleExport} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
