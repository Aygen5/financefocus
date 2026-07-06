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
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ROUTES from "@/constants/routes";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const navigationConfig: NavigationItem[] = [
  { path: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { path: ROUTES.TRANSACTIONS, label: "Transactions", icon: ArrowLeftRight },
  { path: ROUTES.BUDGET, label: "Budget Planner", icon: PieChart },
  { path: ROUTES.PORTFOLIO, label: "Portfolio", icon: Briefcase },
  { path: ROUTES.GOALS, label: "Goals", icon: Target },
  { path: ROUTES.FORECAST, label: "Forecast Engine", icon: TrendingUp },
  { path: ROUTES.FINANCIAL_HEALTH, label: "Finance Health", icon: ShieldCheck },
  { path: ROUTES.REPORTS, label: "Reports", icon: FileText },
  { path: ROUTES.ACTIVITY, label: "Activity Log", icon: Activity },
  { path: ROUTES.NOTIFICATIONS, label: "Notifications", icon: Bell },
  { path: ROUTES.SUBSCRIPTIONS, label: "Subscription", icon: CalendarCheck },
  { path: ROUTES.SETTINGS, label: "Settings", icon: Settings },
];

export default navigationConfig;
