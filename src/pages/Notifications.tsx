import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchNotifications,
  markAllNotificationsRead,
} from "@/features/notifications/notificationsSlice";
import NotificationFeed from "@/features/notifications/components/NotificationFeed";
import NotificationSidebar from "@/features/notifications/components/NotificationSidebar";
import Button from "@/components/ui/Button";
import { CheckCheck, Settings, Info } from "lucide-react";
import toast from "react-hot-toast";

const Notifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: notifications, loading } = useAppSelector((state) => state.notifications);

  // States
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsRead());
      toast.success("Tüm bildirimler okundu olarak işaretlendi!");
    } catch {
      toast.error("İşlem gerçekleştirilemedi.");
    }
  };

  const handleAuthorize = (id: string) => {
    toast.success(`Ödeme yetkilendirildi: ${id}`);
  };

  const handleDetails = (id: string) => {
    toast.success(`Bildirim detayları açılıyor: ${id}`);
  };

  const handleManageStorage = () => {
    toast.success("Arşiv/Depolama ayarlarına yönlendiriliyor.");
  };

  // Mock Bildirim Verileri
  const mockNotifications = [
    {
      id: "1",
      userId: "1",
      title: "Quarterly SaaS Subscription Due",
      message:
        "Adobe Creative Cloud for Teams aboneliğiniz için $1,240.00 tutarındaki ödeme yarın gerçekleştirilecektir.",
      type: "warning",
      read: false,
      createdAt: "2026-07-04T07:42:00Z",
      timeAgo: "2 hours ago",
      category: "payments",
    },
    {
      id: "2",
      userId: "1",
      title: "Marketing Budget at 85%",
      message:
        "Aylık 10.000$ bütçenizin 8.500$'ını harcadınız. Kampanyaları gözden geçirmek isteyebilirsiniz.",
      type: "info",
      read: false,
      createdAt: "2026-07-04T04:42:00Z",
      timeAgo: "5 hours ago",
      category: "budgets",
      threshold: 85,
    },
    {
      id: "3",
      userId: "1",
      title: "New Portfolio Analytics v2.4",
      message:
        "Uluslararası hisse senetleri ve kripto varlıklar için geliştirilmiş anlık takip özelliğini yayına aldık.",
      type: "success",
      read: true,
      createdAt: "2026-07-03T10:00:00Z",
      timeAgo: "Yesterday",
      category: "updates",
    },
    {
      id: "4",
      userId: "1",
      title: "New Login Detected",
      message:
        "Londra, İngiltere konumundan Mac OS tabanlı Chrome tarayıcıyla yeni bir giriş tespit edildi.",
      type: "error",
      read: true,
      createdAt: "2026-07-03T09:00:00Z",
      timeAgo: "Yesterday",
      category: "security",
    },
  ];

  const sourceNotifications = notifications.length > 0 ? notifications : mockNotifications;

  // Filtreleme Mantığı
  const filteredNotifications = sourceNotifications.filter((notif) => {
    if (filter === "All") return true;
    return (
      notif.category?.toLowerCase() === filter.toLowerCase() ||
      notif.type?.toLowerCase() === filter.toLowerCase()
    );
  });

  const unreadCount = sourceNotifications.filter((n) => !n.read).length;

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Notification Center</h2>
          <p className="font-body-md text-body-md text-slate-500 font-medium">
            Stay updated with your financial health and system activities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<CheckCheck size={18} />}
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
          <Button
            variant="outline"
            icon={<Settings size={18} />}
            onClick={() => toast.success("Bildirim ayarlarına gidiliyor.")}
          />
        </div>
      </div>

      {/* Filters & Stats Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter mb-8">
        {/* Filter Tabs list */}
        <div className="lg:col-span-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide select-none">
          {(["All", "Payments", "Budgets", "Updates", "Security"] as const).map((tab) => {
            const isSelected = filter === tab;
            // Bildirim sayıları
            const count = tab === "Payments" ? 3 : 0; // Şablon verisi

            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2.5 rounded-full font-label-md text-label-md transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-primary text-white shadow-soft-sm font-bold"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 font-semibold"
                }`}
              >
                {tab}
                {count > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isSelected ? "bg-white text-primary" : "bg-primary text-white"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Summary Unread count Card */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/85 p-4 rounded-xl flex items-center justify-between shadow-soft-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:text-brand-400">
              <Info size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Okunmamış
              </p>
              <p className="text-headline-sm font-extrabold text-slate-800 dark:text-white">
                {unreadCount} Bildirim
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Bento Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
        {/* Main Feed (Spans 8 columns on xl) */}
        <div className="xl:col-span-8">
          <NotificationFeed
            notifications={filteredNotifications}
            onAuthorize={handleAuthorize}
            onDetails={handleDetails}
            loading={loading}
          />
        </div>

        {/* Sidebar Contextual (Spans 4 columns) */}
        <div className="xl:col-span-4">
          <NotificationSidebar onManageStorage={handleManageStorage} />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
