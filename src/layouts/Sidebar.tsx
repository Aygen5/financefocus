import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleTheme } from "@/store/themeSlice";
import { logout } from "@/features/auth/authSlice";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  TrendingUp,
  Briefcase,
  CalendarCheck,
  FileText,
  Activity,
  Bell,
  Settings,
  LogOut,
  Sun,
  Moon,
  ShieldCheck,
  Landmark,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeMode = useAppSelector((state) => state.theme.mode);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    { path: "/budget", label: "Budget Planner", icon: PieChart },
    { path: "/goals", label: "Goals", icon: Target },
    { path: "/portfolio", label: "Portfolio", icon: Briefcase },
    { path: "/forecast", label: "Forecast Engine", icon: TrendingUp },
    { path: "/subscriptions", label: "Subscriptions", icon: CalendarCheck },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/financial-health", label: "Financial Health", icon: ShieldCheck },
    { path: "/activity", label: "Activity Log", icon: Activity },
    { path: "/notifications", label: "Notifications", icon: Bell },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Stitch UI Menu Active & Inactive Styles
  const activeStyle =
    "flex items-center gap-3 px-4 py-2.5 text-primary dark:text-brand-400 bg-secondary-container dark:bg-slate-800 rounded-lg border-l-4 border-primary dark:border-brand-500 transition-all duration-200 select-none";
  const inactiveStyle =
    "flex items-center gap-3 px-4 py-2.5 text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-slate-800 rounded-lg border-l-4 border-transparent transition-all duration-200 select-none";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface dark:bg-slate-900 border-r border-outline-variant transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-20 border-b border-outline-variant shrink-0 text-left">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-white">
            <Landmark size={20} />
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-brand-400 leading-none">
              FinanceFocus
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-slate-400 font-normal mt-1">
              Enterprise Finance
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 px-4 py-6 text-left">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
              >
                <Icon size={20} className="shrink-0" />
                <span className="font-label-md text-label-md">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-outline-variant space-y-1">
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-slate-800 rounded-lg transition-colors duration-200 cursor-pointer select-none"
          >
            {themeMode === "dark" ? (
              <>
                <Sun size={20} className="text-amber-500" />
                <span className="font-label-md text-label-md">Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={20} className="text-primary" />
                <span className="font-label-md text-label-md">Dark Mode</span>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors duration-200 cursor-pointer select-none"
          >
            <LogOut size={20} />
            <span className="font-label-md text-label-md">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
