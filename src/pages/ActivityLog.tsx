import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchActivities, ActivityLog } from "@/features/activity/activitySlice";
import ActivityStatsSidebar from "@/features/activity/components/ActivityStatsSidebar";
import ActivityTimeline from "@/features/activity/components/ActivityTimeline";
import Button from "@/components/ui/Button";
import { SlidersHorizontal, Download, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const ActivityLogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { logs, loading } = useAppSelector((state) => state.activity);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  const handleFilter = () => {
    toast.success("Aktivite filtreleme paneli açıldı.");
  };

  const handleExportPdf = () => {
    toast.success("Aktivite geçmişi PDF olarak dışa aktarılıyor...");
  };

  const handleViewReport = (id: string) => {
    toast.success(`Rapor görüntüleniyor: ${id}`);
  };

  const handleShareReport = (id: string) => {
    toast.success(`Rapor paylaşım linki kopyalandı: ${id}`);
  };

  const handleLoadArchive = () => {
    toast.success("Eski arşiv logları yükleniyor...");
  };

  // Mock Log Verileri
  const mockLogs: ActivityLog[] = [
    {
      id: "1",
      userId: "1",
      action: "Added transaction",
      details:
        "Amazon Web Services için 'Operational Costs' kategorisine yeni gider kaydı eklendi.",
      timestamp: "10:42",
      timeLabel: "Today",
      category: "transaction",
      meta: {
        idLabel: "Transaction ID: #FF-9281",
        userName: "Alex Rivera",
      },
    },
    {
      id: "2",
      userId: "1",
      action: "Updated budget",
      details:
        "Q3 Pazarlama Stratejisi için çeyreklik bütçe dağılımı değiştirildi. Limit %12 artırıldı.",
      timestamp: "08:15",
      timeLabel: "Today",
      category: "budget",
      meta: {
        progress: 75,
      },
    },
    {
      id: "3",
      userId: "1",
      action: "Created goal",
      details: "Yeni tasarruf hedefi belirlendi: Altyapı Modernizasyon Fonu. Hedef: $500,000.",
      timestamp: "Dün, 16:30",
      timeLabel: "Yesterday",
      category: "goal",
    },
    {
      id: "4",
      userId: "1",
      action: "System Settings Modified",
      details:
        "Güvenlik protokolü gereği tüm 'Admin' rolleri için çok faktörlü kimlik doğrulama zorunlu kılındı.",
      timestamp: "Dün, 11:20",
      timeLabel: "Yesterday",
      category: "settings",
    },
    {
      id: "5",
      userId: "1",
      action: "Generated Monthly Report",
      details: "Eylül 2023 için otomatik performans raporu hazırlandı. Durum: Tamamlandı.",
      timestamp: "14 Eki, 09:00",
      timeLabel: "This Week",
      category: "report",
    },
  ];

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Breadcrumb & Page Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 mb-2 font-semibold text-xs select-none">
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span className="text-primary dark:text-brand-400">Activity Log</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">System Activity Log</h2>
          <p className="text-body-md text-slate-500 font-medium mt-1">
            Real-time audit trail of all financial actions and system changes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<SlidersHorizontal size={18} />} onClick={handleFilter}>
            Filtrele
          </Button>
          <Button variant="outline" icon={<Download size={18} />} onClick={handleExportPdf}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Bento Grid Layout (12 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Summary Sidebar (3 columns on lg) */}
        <div className="col-span-12 lg:col-span-3">
          <ActivityStatsSidebar onViewReport={() => handleViewReport("intelligence-weekly")} />
        </div>

        {/* Main Timeline (9 columns on lg) */}
        <div className="col-span-12 lg:col-span-9">
          <ActivityTimeline
            logs={logs.length > 0 ? logs : mockLogs}
            loading={loading}
            onLoadArchive={handleLoadArchive}
            onViewReport={handleViewReport}
            onShareReport={handleShareReport}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogPage;
