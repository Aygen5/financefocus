import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { LayoutProvider } from "./LayoutContext";
import { cn } from "@/utils/styles";

const ContentFallback: React.FC = () => (
  <div className="w-full space-y-6 animate-pulse select-none mt-2 text-left">
    <div className="space-y-2 mb-8">
      <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
      <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    </div>
    <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
  </div>
);

const MainLayoutContent: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-250 select-none">
      {/* Sidebar - 280px or 80px */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Topbar */}
        <Topbar />

        {/* Dynamic Page Views Outlet Container */}
        <main
          className={cn(
            "flex-1 overflow-y-auto px-6 py-8 mt-16 custom-scrollbar flex justify-center",
            "w-full max-w-container-max mx-auto text-left",
          )}
        >
          <div className="w-full animate-fadeIn">
            <React.Suspense fallback={<ContentFallback />}>
              <Outlet />
            </React.Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export const MainLayout: React.FC = () => {
  return (
    <LayoutProvider>
      <MainLayoutContent />
    </LayoutProvider>
  );
};

export default MainLayout;
