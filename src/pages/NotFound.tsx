import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ArrowLeft } from "lucide-react";
import ROUTES from "@/constants/routes";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12 text-center select-none font-sans">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-8 md:p-12 rounded-3xl shadow-soft-xl flex flex-col items-center">
        <div className="w-20 h-20 bg-primary/10 dark:bg-brand-500/10 rounded-full flex items-center justify-center text-primary dark:text-brand-400 mb-6">
          <HelpCircle size={40} />
        </div>

        <h1 className="text-7xl font-extrabold text-primary dark:text-brand-400 tracking-tight leading-none mb-4">
          404
        </h1>

        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Sayfa Bulunamadı</h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Aradığınız sayfa silinmiş, ismi değiştirilmiş veya geçici olarak kullanım dışı olabilir.
        </p>

        <Link
          to={ROUTES.DASHBOARD}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-container text-white hover:text-on-primary-container font-label-md text-label-md rounded-xl transition-all duration-200 shadow-md cursor-pointer"
        >
          <ArrowLeft size={16} />
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
