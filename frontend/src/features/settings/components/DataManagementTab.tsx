import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/overlay/Modal";
import { Database, Trash2, Rocket, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import onboardingApi from "@/api/onboardingApi";
import { useAppDispatch } from "@/store";
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

const DataManagementTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const [seedLoading, setSeedLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  const refreshAllModules = () => {
    dispatch(fetchDashboardData());
    dispatch(fetchTransactions());
    dispatch(fetchBudgets());
    dispatch(fetchPortfolio());
    dispatch(fetchGoals());
    dispatch(fetchSubscriptions());
    dispatch(fetchFinancialHealth());
    dispatch(fetchActivities());
    dispatch(fetchNotifications());
  };

  const handleSeed = async () => {
    setSeedLoading(true);
    try {
      localStorage.setItem("is_demo_mode", "true");
      const res = await onboardingApi.seedDemoData();
      if (res.success) {
        toast.success(res.message || "Demo verileri başarıyla oluşturuldu!");
        refreshAllModules();
      } else {
        toast.error(res.message || "Demo verileri yüklenemedi.");
      }
    } catch {
      toast.error("Demo verileri yüklenirken hata oluştu.");
    } finally {
      setSeedLoading(false);
    }
  };

  const handleClear = async () => {
    setClearLoading(true);
    try {
      const res = await onboardingApi.clearDemoData();
      if (res.success) {
        toast.success(res.message || "Demo verileri başarıyla temizlendi.");
        refreshAllModules();
      } else {
        toast.error(res.message || "Demo verileri temizlenemedi.");
      }
    } catch {
      toast.error("Demo verileri temizlenirken hata oluştu.");
    } finally {
      setClearLoading(false);
      setIsConfirmClearOpen(false);
    }
  };

  return (
    <div className="p-8 space-y-8 text-left select-none">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold leading-tight">
          Veri Yönetimi & Demo Mode
        </h3>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
          Uygulamanızın veri durumunu ve demo modunu güvenli şekilde yönetin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seed Demo Data Card */}
        <div className="bg-slate-50 dark:bg-slate-850 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <Database size={20} />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-white">
              2026 Production Demo Verilerini Yükle
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Uygulamanın tüm modüllerini (İşlemler, Bütçe, Portföy, Hedefler, Abonelikler) zengin
              2026 örnek veri setiyle doldurur.
            </p>
          </div>

          <Button
            variant="primary"
            icon={
              seedLoading ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />
            }
            onClick={handleSeed}
            loading={seedLoading}
          >
            Demo Verilerini Yükle
          </Button>
        </div>

        {/* Clear Demo Data Card */}
        <div className="bg-slate-50 dark:bg-slate-850 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <Trash2 size={20} />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
              Demo Verilerini Temizle <ShieldCheck size={16} className="text-emerald-500" />
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Yalnızca **Demo Mode** tarafından eklenen örnek verileri temizler. Manuel eklediğiniz
              gerçek verileriniz **%100 güvende** kalır.
            </p>
          </div>

          <Button
            variant="outline"
            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
            icon={
              clearLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />
            }
            onClick={() => setIsConfirmClearOpen(true)}
            loading={clearLoading}
          >
            Demo Verilerini Temizle
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        title="Demo Verilerini Temizle"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsConfirmClearOpen(false)}>
              İptal
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleClear}
              loading={clearLoading}
            >
              Evet, Temizle
            </Button>
          </div>
        }
      >
        <div className="flex items-start gap-4 text-left">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white">
              Demo verilerini temizlemek istediğinizden emin misiniz?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Yalnızca sistem tarafından yüklenen demo veriler temizlenecektir. Manuel
              oluşturduğunuz gerçek finansal verileriniz ve ayarlarınız kesinlikle silinmez.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DataManagementTab;
