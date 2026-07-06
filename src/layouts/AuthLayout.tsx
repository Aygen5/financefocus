import React from "react";
import { Outlet } from "react-router-dom";
import { Wallet } from "lucide-react";

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-screen flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-250 select-none">
      {/* Sol Panel: Tanıtım & Görsel Alanı (Geniş Ekranlar için) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary dark:bg-slate-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Arka plan gradiyent efekti */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 to-primary/80 dark:from-slate-950/40 dark:to-slate-900 pointer-events-none" />

        {/* Üst Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Wallet size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none">FinanceFocus</h1>
            <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mt-1">
              Enterprise Finance
            </p>
          </div>
        </div>

        {/* Orta Tanıtım Metni */}
        <div className="my-auto max-w-md relative z-10 text-left">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Geleceğin Finans Yönetimini Keşfedin.
          </h2>
          <p className="mt-4 text-white/80 font-medium text-lg leading-relaxed">
            Yapay zeka destekli tahminler, bütçe planlama araçları ve detaylı analizlerle
            işletmenizin ya da kişisel bütçenizin kontrolünü tamamen elinize alın.
          </p>
        </div>

        {/* Alt Bilgi */}
        <div className="relative z-10 text-left text-sm text-white/50 font-medium">
          &copy; {new Date().getFullYear()} FinanceFocus. Bütün hakları saklıdır.
        </div>
      </div>

      {/* Sağ Panel: Formların Render Edileceği Alan */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-soft-xl relative">
          {/* Mobil Görünüm için Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 text-left justify-center">
            <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-brand-500/10 flex items-center justify-center text-primary dark:text-brand-400">
              <Wallet size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-none">
                FinanceFocus
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-1">
                Enterprise Finance
              </p>
            </div>
          </div>

          <React.Suspense
            fallback={
              <div className="h-64 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            }
          >
            <Outlet />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
