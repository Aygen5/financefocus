import React from "react";
import { useRouteError, Link, useNavigate } from "react-router-dom";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import ROUTES from "@/constants/routes";
import { format } from "date-fns";

interface RouteError {
  status?: number;
  code?: string;
  message?: string;
  stack?: string;
}

const ErrorPage: React.FC = () => {
  const error = useRouteError() as RouteError | null;
  const isDev = process.env.NODE_ENV === "development" || import.meta.env.DEV;
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.error("[Global Error Boundary Catch]:", error);
    }
  }, [error, isDev]);

  const handleRetry = () => {
    navigate(0);
  };

  const errorCode = error?.status || error?.code || "ERROR_RUNTIME";
  const errorTime = format(new Date(), "dd.MM.yyyy HH:mm:ss");

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12 text-center select-none font-sans">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-8 md:p-12 rounded-3xl shadow-soft-xl flex flex-col items-center animate-zoomIn">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
          <AlertOctagon size={40} />
        </div>

        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
          Beklenmeyen bir hata oluştu.
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          {error?.message ||
            "Finansal veriler işlenirken sistemsel bir hata meydana geldi. Teknik ekibimiz durumdan haberdar edildi."}
        </p>

        {isDev && error?.stack && (
          <div className="w-full text-left bg-slate-100 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 overflow-auto max-h-40 mb-6 select-text custom-scrollbar">
            {error.stack}
          </div>
        )}

        <div className="w-full bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 text-[11px] font-semibold text-slate-450 dark:text-slate-500 space-y-1 mb-8 text-left">
          <div className="flex justify-between">
            <span>Hata Kodu:</span>
            <span className="font-mono text-slate-600 dark:text-slate-400">{errorCode}</span>
          </div>
          <div className="flex justify-between">
            <span>Hata Zamanı:</span>
            <span>{errorTime}</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-container text-white hover:text-on-primary-container font-label-md text-label-md rounded-xl transition-all duration-150 active:scale-[0.97] shadow-md cursor-pointer"
          >
            <RotateCcw size={16} />
            Tekrar Dene
          </button>

          <Link
            to={ROUTES.DASHBOARD}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-label-md text-label-md rounded-xl transition-all duration-150 active:scale-[0.97] cursor-pointer"
          >
            <Home size={16} />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
