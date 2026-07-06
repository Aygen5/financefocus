import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ROUTES from "@/constants/routes";

// Lazy Loading Sayfaları
const Login = React.lazy(() => import("@/pages/Login"));
const Register = React.lazy(() => import("@/pages/Register"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const Transactions = React.lazy(() => import("@/pages/Transactions"));
const Budget = React.lazy(() => import("@/pages/Budget"));
const Goals = React.lazy(() => import("@/pages/Goals"));
const Forecast = React.lazy(() => import("@/pages/Forecast"));
const Portfolio = React.lazy(() => import("@/pages/Portfolio"));
const Subscriptions = React.lazy(() => import("@/pages/Subscriptions"));
const Reports = React.lazy(() => import("@/pages/Reports"));
const FinancialHealth = React.lazy(() => import("@/pages/FinancialHealth"));
const Notifications = React.lazy(() => import("@/pages/Notifications"));
const Activity = React.lazy(() => import("@/pages/ActivityLog"));
const Settings = React.lazy(() => import("@/pages/Settings"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

export const router = createBrowserRouter([
  {
    // Giriş Yapmamış Kullanıcı Rotaları (AuthRoute Koruması)
    element: <AuthRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: <Login />,
          },
          {
            path: ROUTES.REGISTER,
            element: <Register />,
          },
        ],
      },
    ],
  },
  {
    // Giriş Yapmış Kullanıcı Rotaları (ProtectedRoute & MainLayout Koruması)
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to={ROUTES.DASHBOARD} replace />,
          },
          {
            path: ROUTES.DASHBOARD,
            element: <Dashboard />,
          },
          {
            path: ROUTES.TRANSACTIONS,
            element: <Transactions />,
          },
          {
            path: ROUTES.BUDGET,
            element: <Budget />,
          },
          {
            path: ROUTES.GOALS,
            element: <Goals />,
          },
          {
            path: ROUTES.FORECAST,
            element: <Forecast />,
          },
          {
            path: ROUTES.PORTFOLIO,
            element: <Portfolio />,
          },
          {
            path: ROUTES.SUBSCRIPTIONS,
            element: <Subscriptions />,
          },
          {
            path: ROUTES.REPORTS,
            element: <Reports />,
          },
          {
            path: ROUTES.FINANCIAL_HEALTH,
            element: <FinancialHealth />,
          },
          {
            path: ROUTES.NOTIFICATIONS,
            element: <Notifications />,
          },
          {
            path: ROUTES.ACTIVITY,
            element: <Activity />,
          },
          {
            path: ROUTES.SETTINGS,
            element: <Settings />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
