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
  { path: ROUTES.DASHBOARD, label: "Özet Ekranı", icon: LayoutDashboard },
  { path: ROUTES.TRANSACTIONS, label: "İşlem Geçmişi", icon: ArrowLeftRight },
  { path: ROUTES.BUDGET, label: "Bütçe Planlayıcı", icon: PieChart },
  { path: ROUTES.PORTFOLIO, label: "Varlık Portföyü", icon: Briefcase },
  { path: ROUTES.GOALS, label: "Finansal Hedefler", icon: Target },
  { path: ROUTES.FORECAST, label: "Tahmin Motoru", icon: TrendingUp },
  { path: ROUTES.FINANCIAL_HEALTH, label: "Finansal Sağlık", icon: ShieldCheck },
  { path: ROUTES.REPORTS, label: "Raporlar", icon: FileText },
  { path: ROUTES.ACTIVITY, label: "İşlem Günlükleri", icon: Activity },
  { path: ROUTES.NOTIFICATIONS, label: "Bildirimler", icon: Bell },
  { path: ROUTES.SUBSCRIPTIONS, label: "Abonelikler", icon: CalendarCheck },
  { path: ROUTES.SETTINGS, label: "Ayarlar", icon: Settings },
];

export default navigationConfig;
