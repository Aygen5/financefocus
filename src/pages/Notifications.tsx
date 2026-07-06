import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/features/notifications/notificationsSlice";
import Button from "@/components/ui/Button";
import {
  CheckCheck,
  Trash2,
  Bell,
  Info,
  CircleAlert,
  CheckCircle,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import ErrorState from "@/components/feedback/ErrorState";
import EmptyState from "@/components/feedback/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import { cn } from "@/utils/styles";

const getIcon = (iconName: string, type: string) => {
  const styles = "w-5 h-5 shrink-0 mt-0.5";
  switch (iconName) {
    case "LogIn":
      return <CheckCircle className={cn(styles, "text-emerald-500")} />;
    case "Sliders":
      return <Info className={cn(styles, "text-indigo-500")} />;
    case "CreditCard":
      return <Info className={cn(styles, "text-purple-500")} />;
    case "Award":
      return <CheckCircle className={cn(styles, "text-amber-500")} />;
    default:
      return type === "error" ? (
        <CircleAlert className={cn(styles, "text-red-500")} />
      ) : (
        <Info className={cn(styles, "text-slate-400")} />
      );
  }
};

const formatTimeAgo = (timestampStr: string) => {
  try {
    const date = parseISO(timestampStr);
    return formatDistanceToNow(date, { addSuffix: true, locale: enUS });
  } catch {
    return "unknown time";
  }
};

const Notifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: notifications = [],
    loading = false,
    error = null,
  } = useAppSelector((state) => state.notifications || {});

  // States
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllRead = async () => {
    await dispatch(markAllNotificationsRead());
    toast.success("Tüm bildirimler okundu olarak işaretlendi.");
  };

  const handleMarkRead = async (id: string) => {
    await dispatch(markNotificationRead(id));
    toast.success("Bildirim okundu.");
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteNotification(id));
    toast.success("Bildirim silindi.");
  };

  const handleRetry = () => {
    dispatch(fetchNotifications());
  };

  // Filter logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (filter === "All") return true;
      if (filter === "Unread") return !notif.isRead;
      return notif.type === filter.toLowerCase();
    });
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left space-y-8 select-none">
        <div className="space-y-2">
          <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <SkeletonCard hasAvatar={false} lines={2} className="h-24" />
          <SkeletonCard hasAvatar={false} lines={2} className="h-24" />
          <SkeletonCard hasAvatar={false} lines={2} className="h-24" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left py-12">
        <ErrorState
          title="Bildirimler Yüklenemedi"
          description="Bildirim kutusu mock sunucudan çekilirken bir problem yaşandı. Lütfen tekrar deneyiniz."
          onRetry={handleRetry}
          retryLabel="Yeniden Dene"
          retryIcon={<RotateCcw size={16} />}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 select-none">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Notification Center
          </h2>
          <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400 font-medium mt-1">
            Hesap hareketleriniz, hedefleriniz ve sistem güncellemelerinizle ilgili anlık
            bildirimler.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<CheckCheck size={18} />}
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            Tümünü Okundu Yap
          </Button>
        </div>
      </div>

      {/* Filters & Summary Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter mb-8 select-none">
        {/* Filter Tabs */}
        <div className="lg:col-span-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { value: "All", label: "Tüm Bildirimler" },
            { value: "Unread", label: "Okunmamış" },
            { value: "success", label: "Başarılar" },
            { value: "info", label: "Bilgiler" },
            { value: "warning", label: "Uyarılar" },
            { value: "error", label: "Hatalar" },
          ].map((tab) => {
            const isSelected = filter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={cn(
                  "px-5 py-2.5 rounded-full font-label-md text-label-md transition-all cursor-pointer",
                  isSelected
                    ? "bg-primary text-white shadow-soft-sm font-bold"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 font-semibold",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Unread Counter Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/85 p-4 rounded-xl flex items-center justify-between shadow-soft-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:text-brand-400">
              <Bell size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Okunmamış
              </p>
              <p className="text-sm font-black text-slate-850 dark:text-white leading-none mt-1">
                {unreadCount} Yeni Bildirim
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification List / Empty State */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          title="Bildirim Bulunmuyor"
          description="Seçtiğiniz filtreye uygun herhangi bir sistem bildirimi kaydı bulunmamaktadır."
          icon={<MessageSquare size={24} />}
        />
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "p-4 rounded-2xl border transition-all flex gap-4 items-start bg-white dark:bg-slate-900 relative group shadow-soft-sm",
                notif.isRead
                  ? "border-slate-100 dark:border-slate-800/60 opacity-75"
                  : "border-blue-500/20 bg-blue-50/10 dark:bg-blue-950/10",
              )}
            >
              {getIcon(notif.icon, notif.type)}
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4
                    className={cn(
                      "text-xs font-black",
                      notif.isRead
                        ? "text-slate-700 dark:text-slate-350"
                        : "text-slate-850 dark:text-white",
                    )}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-3xl">
                  {notif.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-500 cursor-pointer"
                    title="Okundu İşaretle"
                  >
                    <CheckCheck size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-500 cursor-pointer"
                  title="Bildirimi Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
