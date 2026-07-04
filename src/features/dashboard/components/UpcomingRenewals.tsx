import React from "react";
import type { Subscription } from "@/features/subscriptions/subscriptionsSlice";
import { formatCurrency } from "@/utils/financial";

export interface UpcomingRenewalsProps {
  subscriptions: Subscription[];
  loading?: boolean;
}

const UpcomingRenewals: React.FC<UpcomingRenewalsProps> = ({ subscriptions, loading = false }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 shadow-soft-sm text-left">
      <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight mb-4">
        Yaklaşan Yenilemeler
      </h3>

      {loading ? (
        <div className="space-y-3">
          <div className="h-12 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-12 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {subscriptions.map((sub) => {
            const firstLetter = sub.name.charAt(0).toUpperCase();

            // Netflix kırmızı, Spotify yeşil, diğerleri mavi/gri vb. dinamik stil
            const getLogoStyles = (name: string) => {
              const lower = name.toLowerCase();
              if (lower.includes("netflix")) {
                return "bg-red-500/10 text-red-600 dark:text-red-400";
              }
              if (lower.includes("spotify")) {
                return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
              }
              return "bg-brand-500/10 text-brand-600 dark:text-brand-400";
            };

            return (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${getLogoStyles(
                      sub.name,
                    )}`}
                  >
                    {firstLetter}
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-slate-800 dark:text-slate-200 leading-tight">
                      {sub.name}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                      {sub.nextBillingDate}
                    </p>
                  </div>
                </div>
                <span className="font-label-md text-label-md text-slate-800 dark:text-slate-200">
                  {formatCurrency(-sub.cost, "USD", "en-US")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingRenewals;
