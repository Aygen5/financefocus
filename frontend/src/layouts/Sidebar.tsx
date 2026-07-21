import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleTheme } from "@/store/themeSlice";
import { logout } from "@/features/auth/authSlice";
import { addActivityLog } from "@/features/activity/activitySlice";
import { addNotification } from "@/features/notifications/notificationsSlice";
import { useLayout } from "./LayoutContext";
import navigationConfig from "@/config/navigation.config";
import ROUTES from "@/constants/routes";
import { cn } from "@/utils/styles";
import { LogOut, Sun, Moon, Wallet, ChevronLeft, ChevronRight, CircleUser } from "lucide-react";

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const { user } = useAppSelector((state) => state.auth);
  const { isMobileOpen, setMobileOpen, isCollapsed, toggleCollapsed } = useLayout();

  const handleLogout = () => {
    dispatch(
      addActivityLog({
        action: "Oturumu Kapat",
        category: "Auth",
        description: "Kullanıcı sistemden çıkış yaptı.",
        user: displayName,
        icon: "LogOut",
        status: "info",
      }),
    );
    dispatch(
      addNotification({
        title: "Çıkış Yapıldı",
        message: "Hesabınızdan güvenli şekilde çıkış yapıldı.",
        type: "info",
        icon: "LogOut",
      }),
    );
    dispatch(logout());
    setMobileOpen(false);
    navigate(ROUTES.LOGIN);
  };

  const activeStyle =
    "flex items-center gap-3 px-4 py-3 text-primary dark:text-brand-400 bg-secondary-container dark:bg-slate-800 rounded-xl border-l-4 border-primary dark:border-brand-500 transition-all duration-200 select-none font-bold";
  const inactiveStyle =
    "flex items-center gap-3 px-4 py-3 text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl border-l-4 border-transparent transition-all duration-200 select-none font-semibold";

  const displayName = user?.name || "Aygen";
  const displayEmail = user?.email || "aygen@financefocus.com";

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-outline-variant transition-all duration-300 lg:static lg:translate-x-0 text-left shrink-0 select-none",
          isCollapsed ? "w-20" : "w-[280px]",
          isMobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-outline-variant shrink-0">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-white shrink-0 shadow-soft-sm">
              <Wallet size={20} />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-brand-400 leading-none">
                  FinanceFocus
                </h1>
                <p className="font-label-sm text-label-sm text-slate-450 dark:text-slate-550 font-semibold uppercase tracking-wider mt-1">
                  Kurumsal
                </p>
              </div>
            )}
          </Link>

          {!isMobileOpen && (
            <button
              onClick={toggleCollapsed}
              className="hidden lg:flex items-center justify-center p-1.5 rounded-lg border border-outline-variant hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label={isCollapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 px-4 py-6">
          {navigationConfig.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    isActive ? activeStyle : inactiveStyle,
                    isCollapsed && "justify-center px-0 w-12 h-12 mx-auto",
                  )
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="text-sm font-bold">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-outline-variant p-4">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/40",
              isCollapsed && "justify-center p-0 border-none bg-transparent",
            )}
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary dark:bg-brand-500/10 dark:text-brand-400 flex items-center justify-center shrink-0">
              <CircleUser size={22} />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none mb-1">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 truncate leading-none font-medium">
                  {displayEmail}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 pt-0 space-y-1">
          <button
            onClick={() => dispatch(toggleTheme())}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer select-none font-bold",
              isCollapsed && "justify-center px-0 w-12 h-10 mx-auto",
            )}
            title={isCollapsed ? (themeMode === "dark" ? "Açık Tema" : "Karanlık Tema") : undefined}
          >
            {themeMode === "dark" ? (
              <>
                <Sun size={20} className="text-amber-500 shrink-0" />
                {!isCollapsed && <span className="text-xs">Açık Tema</span>}
              </>
            ) : (
              <>
                <Moon size={20} className="text-primary shrink-0" />
                {!isCollapsed && <span className="text-xs">Karanlık Tema</span>}
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer select-none font-bold",
              isCollapsed && "justify-center px-0 w-12 h-10 mx-auto",
            )}
            title={isCollapsed ? "Çıkış Yap" : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-xs">Çıkış Yap</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
