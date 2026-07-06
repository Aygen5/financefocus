export const ENDPOINTS = {
  AUTH: {
    // TODO: [Backend Entegrasyonu] Gerçek API'de login ve register endpoint yolları güncellenmelidir (örn. /auth/login, /auth/register)
    LOGIN: "/users", // Mock API'de kullanıcı listesinden doğrulayacağımız için
    REGISTER: "/users",
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
  },
  REPORTS: {
    BASE: "/reports",
    DETAIL: (id: string) => `/reports/${id}`,
  },
  SETTINGS: {
    BASE: "/settings",
  },
  NOTIFICATIONS: {
    BASE: "/notifications",
    DETAIL: (id: string) => `/notifications/${id}`,
    MARK_ALL_READ: "/notifications/mark-all-read",
  },
  SUBSCRIPTIONS: {
    BASE: "/subscriptions",
    DETAIL: (id: string) => `/subscriptions/${id}`,
  },
  FORECAST: {
    BASE: "/forecastHistory",
  },
  FINANCE_HEALTH: {
    BASE: "/financeHealthHistory",
  },
  ACTIVITY_LOG: {
    BASE: "/activityLogs",
  },
} as const;

export default ENDPOINTS;
