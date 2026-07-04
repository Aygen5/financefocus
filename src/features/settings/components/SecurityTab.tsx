import React from "react";
import Button from "@/components/ui/Button";
import { Lock, ShieldCheck, Trash2 } from "lucide-react";
import Switch from "@/components/ui/Switch";

export interface SecurityTabProps {
  twoFactorEnabled?: boolean;
  onToggleTwoFactor?: (checked: boolean) => void;
  onUpdatePassword?: () => void;
  onDeleteAccount?: () => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  twoFactorEnabled = true,
  onToggleTwoFactor,
  onUpdatePassword,
  onDeleteAccount,
}) => {
  return (
    <div className="p-8 space-y-8 text-left">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold leading-tight">
          Security &amp; Privacy
        </h3>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
          Şifrenizi ve iki faktörlü kimlik doğrulama ayarlarınızı yönetin.
        </p>
      </div>

      <div className="space-y-4">
        {/* Password update */}
        <div className="p-4 border border-slate-200/80 dark:border-slate-800/80 rounded-xl flex items-center justify-between shadow-soft-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-primary dark:text-brand-400">
              <Lock size={18} />
            </div>
            <div>
              <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold">
                Şifre
              </p>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                En son 3 ay önce değiştirildi
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onUpdatePassword}>
            Güncelle (Update)
          </Button>
        </div>

        {/* Two factor */}
        <div className="p-4 border border-slate-200/80 dark:border-slate-800/80 rounded-xl flex items-center justify-between shadow-soft-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold">
                İki Faktörlü Doğrulama
              </p>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                Hesabınıza ekstra güvenlik katmanı ekler
              </p>
            </div>
          </div>
          <Switch checked={twoFactorEnabled} onChange={onToggleTwoFactor} />
        </div>
      </div>

      {/* Danger zone */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80">
        <h4 className="font-label-md text-label-md text-red-650 font-bold mb-4">
          Tehlikeli Alan (Danger Zone)
        </h4>
        <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-red-650 font-bold">Hesabı Sil</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Hesabınızı sildiğinizde, tüm verileriniz kalıcı olarak kaldırılır. Bu işlem geri
              alınamaz.
            </p>
          </div>
          <Button
            variant="outline"
            icon={<Trash2 size={16} />}
            onClick={onDeleteAccount}
            className="border-red-500 text-red-650 hover:bg-red-500/10 font-bold"
          >
            Hesabı Sil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
