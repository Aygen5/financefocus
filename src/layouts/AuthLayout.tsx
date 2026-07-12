import React from "react";
import { Outlet } from "react-router-dom";
import { Landmark } from "lucide-react";

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-250 select-none overflow-y-auto lg:overflow-hidden">
      <section className="w-full lg:w-1/2 relative border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 shrink-0 h-72 sm:h-[380px] lg:h-auto overflow-hidden">
        <img
          src="/login_visual.jpg"
          alt="FinanceFocus Premium Mockup"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-xs relative z-10 space-y-6 text-center lg:text-left">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white mx-auto lg:mx-0">
              <Landmark size={24} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                FinanceFocus
              </h2>
              <p className="text-slate-350 font-semibold text-xs leading-relaxed max-w-sm mx-auto lg:mx-0">
                Varlıklarınızı, bütçelerinizi ve finansal hedeflerinizi Executive Precision
                standartlarında akıllıca yönetin.
              </p>
            </div>
            <div className="pt-6 border-t border-white/10 flex justify-center lg:justify-start gap-8 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <div>
                <p className="text-white text-md font-black leading-none">₺0.00</p>
                <p className="mt-1.5 text-[9px] font-bold text-slate-500">Net Varlık</p>
              </div>
              <div>
                <p className="text-emerald-400 text-md font-black leading-none">100%</p>
                <p className="mt-1.5 text-[9px] font-bold text-slate-500">Güvenlik</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="w-full max-w-[460px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-2xl shadow-soft-xl animate-zoomIn">
          <React.Suspense
            fallback={
              <div className="h-64 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            }
          >
            <Outlet />
          </React.Suspense>
        </div>
      </section>
    </div>
  );
};

export default AuthLayout;
