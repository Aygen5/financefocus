import React from "react";
import Switch from "@/components/ui/Switch";

export interface NotificationsTabProps {
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  smsEnabled?: boolean;
  onChangeToggle?: (key: string, checked: boolean) => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
  emailEnabled = true,
  pushEnabled = false,
  smsEnabled = false,
  onChangeToggle,
}) => {
  return (
    <div className="p-8 space-y-8 text-left select-none">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold leading-tight">
          Bildirim Tercihleri
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
              E-posta Bildirimleri (Email)
            </p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              Günlük işlem özetleri ve güvenlik uyarıları.
            </p>
          </div>
          <Switch
            checked={emailEnabled}
            onChange={(e) => onChangeToggle?.("emailNotifications", e.target.checked)}
          />
        </div>

        {/* Push */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold">
              Mobil Anlık Uyarılar (Push)
            </p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              Mobil cihazınızda gerçek zamanlı anlık uyarılar.
            </p>
          </div>
          <Switch
            checked={pushEnabled}
            onChange={(e) => onChangeToggle?.("pushNotifications", e.target.checked)}
          />
        </div>

        {/* SMS */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold">
              SMS Bildirimleri (SMS)
            </p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              Önemli hesap hareketleri ve limit aşımlarında kısa mesaj.
            </p>
          </div>
          <Switch
            checked={smsEnabled}
            onChange={(e) => onChangeToggle?.("smsNotifications", e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
