import React from "react";
import { Calendar, BellOff, Monitor, HelpCircle } from "lucide-react";
import { formatCurrency } from "@/utils/financial";
import type { Subscription } from "../subscriptionsSlice";

export interface SubscriptionListProps {
  subscriptions: Subscription[];
  loading?: boolean;
  onManage?: (id: string) => void;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  loading = false,
  onManage,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  // Logo/İkon seçme helper'ı
  const getServiceIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("netflix")) {
      return (
        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center font-bold text-red-600">
          N
        </div>
      );
    }
    if (lower.includes("spotify")) {
      return (
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-600">
          S
        </div>
      );
    }
    if (lower.includes("amazon") || lower.includes("prime")) {
      return (
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center font-bold text-amber-600">
          A
        </div>
      );
    }
    if (lower.includes("internet") || lower.includes("fiber") || lower.includes("wifi")) {
      return (
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-primary">
          <Monitor size={20} />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
        <HelpCircle size={20} />
      </div>
    );
  };

  return (
    <div className="space-y-base text-left">
      {/* Header row for large screens */}
      <div className="hidden lg:grid grid-cols-12 px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/80 mb-4 select-none">
        <div className="col-span-4">Service &amp; Category</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-2 text-center">Cycle</div>
        <div className="col-span-2">Next Payment</div>
        <div className="col-span-2 text-right">Status</div>
      </div>

      {subscriptions.map((sub) => {
        const isAuto =
          sub.billingType?.toLowerCase() === "auto-renew" ||
          sub.billingType?.toLowerCase() === "auto";
        const isScheduled = sub.billingType?.toLowerCase() === "scheduled";

        // Kalan gün formatı hesaplama
        const getRemainingDaysLabel = (dateStr: string) => {
          try {
            const today = new Date();
            const billingDate = new Date(dateStr);
            const diffTime = billingDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 0) return "Bugün ödeniyor";
            if (diffDays === 1) return "Yarın ödeniyor";
            return `${diffDays} gün içinde`;
          } catch {
            return "";
          }
        };

        const formatBillingDate = (dateStr: string) => {
          try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
          } catch {
            return dateStr;
          }
        };

        return (
          <div
            key={sub.id}
            className="bg-white dark:bg-slate-900 group hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 lg:p-6 transition-all duration-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4">
              {/* Service & Category */}
              <div className="col-span-1 lg:col-span-4 flex items-center gap-4">
                {getServiceIcon(sub.name)}
                <div>
                  <h4 className="font-headline-sm text-base text-slate-800 dark:text-white font-bold leading-tight">
                    {sub.name}
                  </h4>
                  <p className="font-body-sm text-body-sm text-slate-400 dark:text-slate-500 mt-1">
                    {sub.category}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-1 lg:col-span-2 text-left lg:text-right">
                <span className="font-headline-sm text-lg text-slate-800 dark:text-white font-extrabold leading-none">
                  {formatCurrency(sub.cost, "USD", "en-US")}
                </span>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase">
                  USD
                </p>
              </div>

              {/* Cycle */}
              <div className="col-span-1 lg:col-span-2 flex lg:justify-center">
                <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full font-label-sm text-slate-500 dark:text-slate-455 font-bold capitalize">
                  {sub.billingCycle}
                </span>
              </div>

              {/* Next Payment */}
              <div className="col-span-1 lg:col-span-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400 dark:text-slate-500" />
                  <span className="font-body-md text-body-md text-slate-800 dark:text-white font-semibold">
                    {formatBillingDate(sub.nextBillingDate)}
                  </span>
                </div>
                <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-1 pl-6">
                  {getRemainingDaysLabel(sub.nextBillingDate)}
                </p>
              </div>

              {/* Status & Actions */}
              <div className="col-span-1 lg:col-span-2 flex flex-col items-end gap-2">
                {isAuto ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Auto-renew
                  </div>
                ) : isScheduled ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold text-xs select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    Scheduled
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-850 text-slate-400 dark:text-slate-500 font-bold text-xs select-none">
                    <BellOff size={12} />
                    Manual Pay
                  </div>
                )}
                <button
                  onClick={() => onManage?.(sub.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-primary dark:text-brand-400 font-label-md hover:underline cursor-pointer"
                >
                  Yönet
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionList;
