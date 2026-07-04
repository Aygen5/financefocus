import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Ana İçerik Alanı */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Dinamik Sayfa İçeriği - Topbar fixed olduğu için pt-16 ile boşluk bırakıldı */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/30 dark:bg-slate-950/20 p-6 pt-20 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
