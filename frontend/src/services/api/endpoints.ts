export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  TRANSACTIONS: {
    BASE: "/transactions",
    DETAIL: (id: string) => `/transactions/${id}`,
  },
  BUDGETS: {
    BASE: "/budgets",
    DETAIL: (id: string) => `/budgets/${id}`,
  },
  GOALS: {
    BASE: "/goals",
    DETAIL: (id: string) => `/goals/${id}`,
  },
  PORTFOLIO: {
    BASE: "/portfolio",
    SUMMARY: "/portfolio/summary",
    DETAIL: (id: string) => `/portfolio/${id}`,
  },
  NOTIFICATIONS: {
    BASE: "/notifications",
    UNREAD_COUNT: "/notifications/unread-count",
    MARK_READ: (id: string) => `/notifications/${id}/mark-read`,
    MARK_ALL_READ: "/notifications/mark-all-read",
  },
  SUBSCRIPTIONS: {
    BASE: "/subscriptions",
    SUMMARY: "/subscriptions/summary",
    UPCOMING: "/subscriptions/upcoming",
    DETAIL: (id: string) => `/subscriptions/${id}`,
  },
  DASHBOARD: {
    BASE: "/dashboard",
    SUMMARY: "/dashboard/summary",
  },
  FINANCE_HEALTH: {
    BASE: "/financial-health",
    SUMMARY: "/financial-health/summary",
    INSIGHTS: "/financial-health/insights",
    SCORE: "/financial-health/score",
  },
  FORECAST: {
    BASE: "/forecast",
    SUMMARY: "/forecast/summary",
    CASHFLOW: "/forecast/cashflow",
    BUDGETS: "/forecast/budgets",
    GOALS: "/forecast/goals",
    PORTFOLIO: "/forecast/portfolio",
    SUBSCRIPTIONS: "/forecast/subscriptions",
  },
  AI_ASSISTANT: {
    BASE: "/aiassistant",
    ADVICE: "/aiassistant/advice",
    SUMMARY: "/aiassistant/summary",
    RISK_ANALYSIS: "/aiassistant/risk-analysis",
    OPPORTUNITIES: "/aiassistant/opportunities",
  },
  ACTIVITY_LOG: {
    BASE: "/activitylogs",
    LATEST: (count: number = 5) => `/activitylogs/latest?count=${count}`,
  },
} as const;

export default ENDPOINTS;
