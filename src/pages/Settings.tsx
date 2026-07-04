import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchSettings, updateSettings } from "@/features/settings/settingsSlice";
import ProfileTab from "@/features/settings/components/ProfileTab";
import SecurityTab from "@/features/settings/components/SecurityTab";
import AppearanceTab from "@/features/settings/components/AppearanceTab";
import NotificationsTab from "@/features/settings/components/NotificationsTab";
import RegionalTab from "@/features/settings/components/RegionalTab";
import { User, Lock, Palette, Bell, Globe, HelpCircle, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

import type { ProfileFormData } from "@/features/settings/settings.types";

type TabType = "profile" | "security" | "appearance" | "notifications" | "regional";

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.settings);

  // States
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("light");

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleProfileSave = async (data: ProfileFormData) => {
    console.log("Profile save triggered:", data);
    toast.success("Profil bilgileri kaydedildi!");
  };

  const handleToggleTwoFactor = (checked: boolean) => {
    dispatch(updateSettings({ twoFactorEnabled: checked }));
    toast.success(checked ? "İki faktörlü doğrulama açıldı!" : "İki faktörlü doğrulama kapatıldı!");
  };

  const handleUpdatePassword = () => {
    toast.success("Şifre güncelleme bağlantısı gönderildi.");
  };

  const handleDeleteAccount = () => {
    toast.error("Hesap silme işlemi yetki sınırları dışındadır.");
  };

  const handleChangeTheme = (mode: "light" | "dark" | "system") => {
    setThemeMode(mode);
    toast.success(`Tema tercihi güncellendi: ${mode}`);
  };

  const handleToggleNotification = (key: string, checked: boolean) => {
    dispatch(updateSettings({ [key]: checked }));
    toast.success("Bildirim tercihi güncellendi.");
  };

  const handleChangeRegional = (key: string, value: string) => {
    dispatch(updateSettings({ [key]: value }));
    toast.success(`Bölgesel ayar güncellendi: ${value}`);
  };

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: <User size={20} /> },
    { id: "security" as TabType, label: "Security", icon: <Lock size={20} /> },
    { id: "appearance" as TabType, label: "Appearance", icon: <Palette size={20} /> },
    { id: "notifications" as TabType, label: "Notifications", icon: <Bell size={20} /> },
    { id: "regional" as TabType, label: "Regional", icon: <Globe size={20} /> },
  ];

  return (
    <div className="w-full max-w-container-max mx-auto text-left relative">
      {/* Page Header */}
      <header className="mb-stack-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface">Account Settings</h2>
        <p className="font-body-md text-body-md text-slate-500 font-medium mt-1">
          Manage your profile, security, and application preferences.
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

        {/* Sağ İçerik Alanı (Canvas container) */}
        <div className="col-span-12 md:col-span-9 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-soft-sm">
          {activeTab === "profile" && <ProfileTab onSave={handleProfileSave} />}

          {activeTab === "security" && (
            <SecurityTab
              twoFactorEnabled={settings.twoFactorEnabled}
              onToggleTwoFactor={handleToggleTwoFactor}
              onUpdatePassword={handleUpdatePassword}
              onDeleteAccount={handleDeleteAccount}
            />
          )}

          {activeTab === "appearance" && (
            <AppearanceTab theme={themeMode} onChangeTheme={handleChangeTheme} />
          )}

          {activeTab === "notifications" && (
            <NotificationsTab
              emailEnabled={settings.emailNotifications}
              pushEnabled={settings.pushNotifications}
              onChangeToggle={handleToggleNotification}
            />
          )}

          {activeTab === "regional" && (
            <RegionalTab
              language={settings.language}
              currency={settings.currency}
              timezone={settings.timezone}
              onChangeRegional={handleChangeRegional}
            />
          )}
        </div>
      </div>

      {/* Floating help button bottom corner */}
      <button
        onClick={() => toast.success("Yardım & Destek modülü açılıyor...")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary dark:bg-brand-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50 cursor-pointer"
      >
        <HelpCircle size={24} />
      </button>
    </div>
  );
};

export default Settings;
