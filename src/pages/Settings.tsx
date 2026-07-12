import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchSettings, updateSettings } from "@/features/settings/settingsSlice";
import { setTheme } from "@/store/themeSlice";
import ProfileTab from "@/features/settings/components/ProfileTab";
import SecurityTab from "@/features/settings/components/SecurityTab";
import AppearanceTab from "@/features/settings/components/AppearanceTab";
import NotificationsTab from "@/features/settings/components/NotificationsTab";
import RegionalTab from "@/features/settings/components/RegionalTab";
import { User, Lock, Palette, Bell, Globe, HelpCircle, ChevronRight } from "lucide-react";
import { addActivityLog } from "@/features/activity/activitySlice";
import { addNotification } from "@/features/notifications/notificationsSlice";
import { HelpModal } from "@/layouts/components/HelpModal";
import { useNavigate } from "react-router-dom";
import ROUTES from "@/constants/routes";
import toast from "react-hot-toast";

import type { ProfileFormData, ChangePasswordFormData } from "@/features/settings/settings.types";

type TabType = "profile" | "security" | "appearance" | "notifications" | "regional";

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { settings } = useAppSelector((state) => state.settings || {});
  const themeMode = useAppSelector((state) => state.theme.mode);

  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleProfileSave = async (data: ProfileFormData) => {
    const resultAction = await dispatch(updateSettings(data));
    if (updateSettings.fulfilled.match(resultAction)) {
      dispatch(
        addActivityLog({
          action: "Settings Updated",
          category: "Settings",
          description: "Profil bilgileri başarıyla güncellendi.",
          user: "Aygen",
          icon: "Settings",
          status: "success",
        }),
      );
      dispatch(
        addNotification({
          title: "Settings güncellendi",
          message: "Profil ayarlarınız başarıyla kaydedildi.",
          type: "success",
          icon: "Settings",
        }),
      );
      toast.success("Profil bilgileri kaydedildi!");
    }
  };

  const handleToggleTwoFactor = async (checked: boolean) => {
    const resultAction = await dispatch(updateSettings({ twoFactorEnabled: checked }));
    if (updateSettings.fulfilled.match(resultAction)) {
      dispatch(
        addActivityLog({
          action: "Settings Updated",
          category: "Settings",
          description: checked
            ? "İki faktörlü doğrulama aktif edildi."
            : "İki faktörlü doğrulama deaktif edildi.",
          user: "Aygen",
          icon: "Lock",
          status: "success",
        }),
      );
      dispatch(
        addNotification({
          title: "Settings güncellendi",
          message: checked
            ? "İki faktörlü güvenlik doğrulaması açıldı."
            : "İki faktörlü güvenlik doğrulaması kapatıldı.",
          type: "info",
          icon: "Lock",
        }),
      );
      toast.success(
        checked ? "İki faktörlü doğrulama açıldı!" : "İki faktörlü doğrulama kapatıldı!",
      );
    }
  };

  const handleUpdatePassword = async (data: ChangePasswordFormData): Promise<boolean> => {
    const resultAction = await dispatch(updateSettings({ password: data.newPassword }));
    if (updateSettings.fulfilled.match(resultAction)) {
      dispatch(
        addActivityLog({
          action: "Settings Updated",
          category: "Settings",
          description: "Hesap giriş şifresi değiştirildi.",
          user: "Aygen",
          icon: "Lock",
          status: "success",
        }),
      );
      dispatch(
        addNotification({
          title: "Settings güncellendi",
          message: "Şifreniz başarıyla güncellendi.",
          type: "success",
          icon: "Lock",
        }),
      );
      toast.success("Şifreniz başarıyla güncellendi!");
      return true;
    }
    return false;
  };

  const handleDeleteAccount = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_settings");

    toast.success("Hesabınız ve verileriniz başarıyla silindi.");
    navigate(ROUTES.LOGIN);
  };

  const handleChangeTheme = (mode: "light" | "dark" | "system") => {
    dispatch(setTheme(mode));
    dispatch(
      addActivityLog({
        action: "Theme Changed",
        category: "Settings",
        description: `Tema tercihi "${mode}" olarak güncellendi.`,
        user: "Aygen",
        icon: "Palette",
        status: "success",
      }),
    );
    dispatch(
      addNotification({
        title: "Settings güncellendi",
        message: `Uygulama görünümü "${mode}" olarak değiştirildi.`,
        type: "success",
        icon: "Palette",
      }),
    );
    toast.success(`Tema tercihi güncellendi: ${mode}`);
  };

  const handleToggleNotification = async (key: string, checked: boolean) => {
    const resultAction = await dispatch(updateSettings({ [key]: checked }));
    if (updateSettings.fulfilled.match(resultAction)) {
      dispatch(
        addActivityLog({
          action: "Settings Updated",
          category: "Settings",
          description: `Bildirim tercihi "${key}" güncellendi.`,
          user: "Aygen",
          icon: "Bell",
          status: "success",
        }),
      );
      dispatch(
        addNotification({
          title: "Settings güncellendi",
          message: `Bildirim tercihleri güncellendi.`,
          type: "success",
          icon: "Bell",
        }),
      );
      toast.success("Bildirim tercihi güncellendi.");
    }
  };

  const handleChangeRegional = async (key: string, value: string) => {
    const resultAction = await dispatch(updateSettings({ [key]: value }));
    if (updateSettings.fulfilled.match(resultAction)) {
      dispatch(
        addActivityLog({
          action: "Settings Updated",
          category: "Settings",
          description: `Bölgesel ayar "${key}" değeri "${value}" olarak değiştirildi.`,
          user: "Aygen",
          icon: "Globe",
          status: "success",
        }),
      );
      dispatch(
        addNotification({
          title: "Settings güncellendi",
          message: `Bölgesel tercihleriniz güncellendi.`,
          type: "success",
          icon: "Globe",
        }),
      );
      toast.success(`Bölgesel ayar güncellendi: ${value}`);
    }
  };

  const tabs = [
    { id: "profile" as TabType, label: "Profil", icon: <User size={20} /> },
    { id: "security" as TabType, label: "Güvenlik", icon: <Lock size={20} /> },
    { id: "appearance" as TabType, label: "Görünüm", icon: <Palette size={20} /> },
    { id: "notifications" as TabType, label: "Bildirimler", icon: <Bell size={20} /> },
    { id: "regional" as TabType, label: "Bölgesel Ayarlar", icon: <Globe size={20} /> },
  ];

  if (!settings) return null;

  return (
    <div className="w-full max-w-container-max mx-auto text-left relative">
      {/* Page Header */}
      <header className="mb-stack-lg select-none">
        <h2 className="font-headline-md text-headline-md text-on-surface">Hesap Ayarları</h2>
        <p className="font-body-md text-body-md text-slate-500 font-medium mt-1">
          Profilinizi, güvenlik ve uygulama tercihlerinizi yönetin.
        </p>
      </header>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Sol Menü (Tabs navigation) */}
        <nav className="col-span-12 md:col-span-3 space-y-2 select-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? "border-primary dark:border-brand-500 bg-blue-50/10 text-primary dark:text-brand-400 font-bold"
                    : "border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:border-slate-350 dark:hover:border-slate-700 font-semibold"
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  <span className="font-label-md text-label-md">{tab.label}</span>
                </div>
                <ChevronRight size={14} className="opacity-50" />
              </button>
            );
          })}
        </nav>

        <div className="col-span-12 md:col-span-9 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-soft-sm">
          {activeTab === "profile" && (
            <ProfileTab
              initialData={{
                fullName: settings.fullName || "",
                email: settings.email || "",
                bio: settings.bio || "",
                profilePicture: settings.profilePicture || "",
              }}
              onSave={handleProfileSave}
            />
          )}

          {activeTab === "security" && (
            <SecurityTab
              twoFactorEnabled={settings.twoFactorEnabled}
              onToggleTwoFactor={handleToggleTwoFactor}
              onUpdatePassword={handleUpdatePassword}
              onDeleteAccount={handleDeleteAccount}
              userEmail={settings.email}
            />
          )}

          {activeTab === "appearance" && (
            <AppearanceTab theme={themeMode} onChangeTheme={handleChangeTheme} />
          )}

          {activeTab === "notifications" && (
            <NotificationsTab
              emailEnabled={settings.emailNotifications}
              pushEnabled={settings.pushNotifications}
              smsEnabled={settings.smsNotifications}
              onChangeToggle={handleToggleNotification}
            />
          )}

          {activeTab === "regional" && (
            <RegionalTab
              language={settings.language}
              currency={settings.currency}
              timezone={settings.timezone}
              dateFormat={settings.dateFormat}
              numberFormat={settings.numberFormat}
              onChangeRegional={handleChangeRegional}
            />
          )}
        </div>
      </div>

      <button
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary dark:bg-brand-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50 cursor-pointer"
        aria-label="Yardım Paneli"
      >
        <HelpCircle size={24} />
      </button>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default Settings;
