import React from "react";
import Switch from "@/components/ui/Switch";

export interface NotificationsTabProps {
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  marketEnabled?: boolean;
  onChangeToggle?: (key: string, checked: boolean) => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
  emailEnabled = true,
  pushEnabled = false,
  marketEnabled = true,
  onChangeToggle,
}) => {
  return (
    <div className="p-8 space-y-8 text-left">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold leading-tight">
          Notification Preferences
        </h3>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
          Hangi bildirimleri almak istediğinize karar verin.
        </p>
      </div>

      <div className="space-y-6">
        {/* Email */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold">
              Email Notifications
            </p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              Günlük işlem özetleri ve güvenlik uyarıları.
            </p>
          </div>
          <Switch
            checked={emailEnabled}
            onChange={(checked) => onChangeToggle?.("emailNotifications", checked)}
          />
        </div>

        {/* Push */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold">
              Push Notifications
            </p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              Mobil cihazınızda gerçek zamanlı anlık uyarılar.
            </p>
          </div>
          <Switch
            checked={pushEnabled}
            onChange={(checked) => onChangeToggle?.("pushNotifications", checked)}
          />
        </div>

        {/* Market */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold">
              Market Updates
            </p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              Borsa trendleri ve volatilite hakkında AI raporları.
            </p>
          </div>
          <Switch
            checked={marketEnabled}
            onChange={(checked) => onChangeToggle?.("marketEnabled", checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
