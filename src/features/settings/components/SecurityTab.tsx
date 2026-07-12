import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../settings.types";
import type { ChangePasswordFormData } from "../settings.types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Switch from "@/components/ui/Switch";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import { Lock, ShieldCheck, Trash2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

export interface SecurityTabProps {
  twoFactorEnabled?: boolean;
  onToggleTwoFactor?: (checked: boolean) => void;
  onUpdatePassword?: (data: ChangePasswordFormData) => Promise<boolean>;
  onDeleteAccount?: () => Promise<void>;
  userEmail?: string;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  twoFactorEnabled = false,
  onToggleTwoFactor,
  onUpdatePassword,
  onDeleteAccount,
  userEmail = "aygen@financefocus.com",
}) => {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isFirstConfirmOpen, setIsFirstConfirmOpen] = useState(false);
  const [isSecondConfirmOpen, setIsSecondConfirmOpen] = useState(false);
  const [confirmEmailInput, setConfirmEmailInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const handlePasswordSubmit = async (data: ChangePasswordFormData) => {
    if (onUpdatePassword) {
      const success = await onUpdatePassword(data);
      if (success) {
        reset();
        setIsPasswordOpen(false);
      }
    }
  };

  const handleFirstConfirm = () => {
    setIsFirstConfirmOpen(false);
    setIsSecondConfirmOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (confirmEmailInput !== userEmail) {
      toast.error("Girdiğiniz e-posta adresi eşleşmiyor!");
      return;
    }
    if (onDeleteAccount) {
      await onDeleteAccount();
      setIsSecondConfirmOpen(false);
    }
  };

  return (
    <div className="p-8 space-y-8 text-left select-none">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold leading-tight">
          Güvenlik &amp; Gizlilik
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
                Hesap güvenliğinizi korumak için şifrenizi güncelleyin
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsPasswordOpen(true)}>
            Şifreyi Değiştir
          </Button>
        </div>

        <div className="p-4 border border-slate-200/80 dark:border-slate-800/80 rounded-xl flex items-center justify-between shadow-soft-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold">
                İki Faktörlü Doğrulama (2FA)
              </p>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                Hesabınıza ekstra güvenlik katmanı ekler
              </p>
            </div>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onChange={(e) => onToggleTwoFactor?.(e.target.checked)}
          />
        </div>
      </div>

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
            onClick={() => setIsFirstConfirmOpen(true)}
            className="border-red-500 text-red-650 hover:bg-red-500/10 font-bold"
          >
            Hesabı Sil
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        title="Şifreyi Değiştir"
        size="sm"
      >
        <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-4 text-left">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 mx-auto">
            <KeyRound size={20} />
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold text-center mb-4">
            Lütfen eski şifrenizi ve yeni belirlemek istediğiniz şifreyi giriniz.
          </p>
          <Input
            label="Mevcut Şifre"
            type="password"
            {...register("oldPassword")}
            error={errors.oldPassword?.message}
          />
          <Input
            label="Yeni Şifre"
            type="password"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />
          <Input
            label="Yeni Şifre Tekrar"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 font-bold text-xs"
              onClick={() => setIsPasswordOpen(false)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 font-bold text-xs"
              loading={isSubmitting}
            >
              Güncelle
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isFirstConfirmOpen}
        onClose={() => setIsFirstConfirmOpen(false)}
        onConfirm={handleFirstConfirm}
        title="Hesabınızı silmek istediğinize emin misiniz?"
        description="Bu işlem sonucunda tüm bütçe, harcama, hedef ve abonelik verileriniz kalıcı olarak silinecektir. Bu işlem geri alınamaz."
        confirmLabel="Devam Et"
        cancelLabel="Vazgeç"
        variant="danger"
      />

      <Modal
        isOpen={isSecondConfirmOpen}
        onClose={() => setIsSecondConfirmOpen(false)}
        title="Silme İşlemini Onaylayın"
        size="sm"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
            Hesabınızı kalıcı olarak silmek için lütfen onaylamak adına e-posta adresinizi (
            <span className="font-extrabold text-red-600 select-all">{userEmail}</span>) yazın:
          </p>
          <Input
            label="E-posta Adresi"
            placeholder="e-posta@adresiniz.com"
            value={confirmEmailInput}
            onChange={(e) => setConfirmEmailInput(e.target.value)}
          />
          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 font-bold text-xs"
              onClick={() => setIsSecondConfirmOpen(false)}
            >
              İptal
            </Button>
            <Button
              type="button"
              variant="danger"
              className="flex-1 font-bold text-xs"
              disabled={confirmEmailInput !== userEmail}
              onClick={handleDeleteSubmit}
            >
              Hesabı Kalıcı Olarak Sil
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SecurityTab;
