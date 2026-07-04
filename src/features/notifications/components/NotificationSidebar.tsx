import React from "react";
import Button from "@/components/ui/Button";
import { TrendingUp, MapPin } from "lucide-react";

export interface NotificationSidebarProps {
  onManageStorage?: () => void;
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ onManageStorage }) => {
  return (
    <div className="space-y-gutter text-left">
      {/* Trends Widget */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-soft-sm">
        <h4 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold mb-4">
          Notification Trends
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-slate-500">Alert Volume</span>
            <span className="text-red-650 font-bold">+12% this week</span>
          </div>
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-slate-500">Avg. Response Time</span>
            <span className="text-slate-800 dark:text-white font-bold">14m</span>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-850">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            En Çok Bildirim Alan Kategori
          </p>
          <div className="flex items-center gap-3">
            <span className="text-primary dark:text-brand-400">
              <TrendingUp size={20} />
            </span>
            <span className="font-body-md text-slate-800 dark:text-white font-bold">
              Transaction Alerts
            </span>
          </div>
        </div>
      </div>

      {/* Storage Widget */}
      <div className="bg-blue-600/90 dark:bg-brand-900/40 text-white rounded-2xl p-6 shadow-soft-sm">
        <h4 className="font-headline-sm text-headline-sm font-bold mb-4">Auto-Clearing Enabled</h4>
        <p className="text-body-md text-blue-100 dark:text-slate-350 opacity-90 mb-6 font-medium leading-relaxed">
          30 günden eski bildirimler, çalışma alanınızı temiz ve düzenli tutmak için otomatik olarak
          arşivlenir.
        </p>
        <Button
          variant="primary"
          onClick={onManageStorage}
          className="w-full bg-white hover:bg-slate-100 text-blue-600 font-bold border-none shadow-lg shadow-blue-900/20"
        >
          Depolamayı Yönet (Manage Storage)
        </Button>
      </div>

      {/* Last Login Location map widget */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-soft-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-1">
          <MapPin size={12} /> Son Giriş Konumu
        </p>
        {/* Map Placeholder */}
        <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800/50 relative flex items-center justify-center">
          {/* Geolocation marker indicator animation */}
          <div className="relative">
            <div className="w-4 h-4 bg-primary rounded-full animate-ping" />
            <div className="w-3 h-3 bg-primary rounded-full absolute top-0.5 left-0.5 shadow-lg" />
          </div>
        </div>
        <div className="mt-3 px-2">
          <p className="text-body-sm font-bold text-slate-800 dark:text-white">
            Londra, Birleşik Krallık
          </p>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            25 Eki 2023 • 10:42
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSidebar;
