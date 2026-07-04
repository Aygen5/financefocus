import React from "react";
import { Bell, CreditCard, Shield, AlertTriangle, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import type { SystemNotification } from "../notificationsSlice";

export interface NotificationFeedProps {
  notifications: SystemNotification[];
  onAuthorize?: (id: string) => void;
  onDetails?: (id: string) => void;
  loading?: boolean;
}

const NotificationFeed: React.FC<NotificationFeedProps> = ({
  notifications,
  onAuthorize,
  onDetails,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        <Bell size={48} className="mx-auto mb-4 opacity-50" />
        <p className="font-semibold text-slate-800 dark:text-white">Yeni Bildirim Bulunmuyor</p>
        <p className="text-sm mt-1">Harika! Tüm süreçleriniz güncel ve kontrol altında.</p>
      </div>
    );
  }

  // İkon ve stil eşleştirme helper'ı
  const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case "payment":
      case "payments":
        return {
          icon: <CreditCard size={22} />,
          badgeColor: "text-red-650 bg-red-50 dark:bg-red-950/20",
          borderLeft: "border-l-4 border-l-red-500",
        };
      case "budget":
      case "budgets":
        return {
          icon: <AlertTriangle size={22} />,
          badgeColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/20",
          borderLeft: "border-l-4 border-l-amber-500",
        };
      case "security":
        return {
          icon: <Shield size={22} />,
          badgeColor: "text-primary bg-blue-50 dark:bg-blue-950/20",
          borderLeft: "border-l-4 border-l-primary",
        };
      default:
        return {
          icon: <RefreshCw size={22} />,
          badgeColor: "text-slate-500 bg-slate-50 dark:bg-slate-850",
          borderLeft: "border-l-4 border-l-slate-400",
        };
    }
  };

  return (
    <div className="space-y-4 text-left">
      {notifications.map((notif) => {
        const styles = getCategoryStyles(notif.category || notif.type);
        const showActions =
          notif.category?.toLowerCase() === "payment" ||
          notif.category?.toLowerCase() === "payments";
        const isBudget =
          notif.category?.toLowerCase() === "budget" || notif.category?.toLowerCase() === "budgets";

        return (
          <div
            key={notif.id}
            className={`group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-xl shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex gap-6 ${
              styles.borderLeft
            } ${!notif.read ? "bg-slate-50/50 dark:bg-slate-850/20" : ""}`}
          >
            {/* Category Icon */}
            <div className="flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.badgeColor}`}
              >
                {styles.icon}
              </div>
            </div>

            {/* Content Details */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${styles.badgeColor} px-2 py-0.5 rounded`}
                >
                  {notif.category || notif.type}
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {notif.timeAgo || "2 saat önce"}
                </span>
              </div>
              <h3 className="font-headline-sm text-base text-slate-800 dark:text-white font-bold leading-tight mb-2">
                {notif.title}
              </h3>

              {/* Bütçe aşımı için ilerleme barı detayı */}
              {isBudget && notif.threshold && (
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mb-3 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${notif.threshold}%` }}
                  />
                </div>
              )}

              <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {notif.message}
              </p>

              {/* Action buttons (Örn. Ödemeyi yetkilendir) */}
              {showActions && (
                <div className="flex gap-3 mt-4">
                  <Button variant="primary" size="sm" onClick={() => onAuthorize?.(notif.id)}>
                    Authorize Now
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDetails?.(notif.id)}>
                    Details
                  </Button>
                </div>
              )}
            </div>

            {/* Unread Alert blue circle Dot */}
            {!notif.read && (
              <div className="absolute right-6 top-6 w-2.5 h-2.5 bg-primary dark:bg-brand-500 rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NotificationFeed;
