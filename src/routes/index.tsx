import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import MainLayout from "@/layouts/MainLayout";

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
const Activity = React.lazy(() => import("@/pages/Activity"));
const Settings = React.lazy(() => import("@/pages/Settings"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Giriş Yapmamış Kullanıcı Rotaları */}
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Giriş Yapmış Kullanıcı Rotaları (Korumalı) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/financial-health" element={<FinancialHealth />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 Sayfası */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
