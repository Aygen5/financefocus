export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  TRANSACTIONS: "/transactions",
  BUDGET: "/budget",
  GOALS: "/goals",
  FORECAST: "/forecast",
  PORTFOLIO: "/portfolio",
  REPORTS: "/reports",
  FINANCIAL_HEALTH: "/financial-health",
  ACTIVITY: "/activity",
  NOTIFICATIONS: "/notifications",
  SUBSCRIPTIONS: "/subscriptions",
  SETTINGS: "/settings",
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = (typeof ROUTES)[RouteKeys];
export default ROUTES;
