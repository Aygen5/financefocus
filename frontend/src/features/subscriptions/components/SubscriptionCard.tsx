import React from "react";
import Badge from "@/components/ui/Badge";
import { formatCurrency, calculateDaysDifference } from "@/utils/financial";
import { Edit2, Trash2, Eye, Calendar, AlertTriangle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import type { Subscription } from "../subscriptionsSlice";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (sub: Subscription) => void;
  onDelete: (sub: Subscription) => void;
  onView: (sub: Subscription) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
  onView,
}) => {
  const priceVal = Number(subscription.price ?? subscription.cost ?? 0);
  const isYearly = subscription.billingCycle?.toLowerCase() === "yearly";
  const monthlyCost = isYearly ? priceVal / 12 : priceVal;

  const daysRemaining = calculateDaysDifference(subscription.nextBillingDate);
  const isUrgent = daysRemaining >= 0 && daysRemaining <= 3;

  const formattedDate = (() => {
    try {
      return format(parseISO(subscription.nextBillingDate), "dd MMM yyyy", { locale: tr });
    } catch {
      return subscription.nextBillingDate;
    }
  })();

  const getStatusBadge = (s?: "active" | "paused" | "cancelled") => {
    switch (s) {
      case "paused":
        return <Badge variant="warning">Duraklatıldı</Badge>;
      case "cancelled":
        return <Badge variant="danger">İptal Edildi</Badge>;
      default:
        return <Badge variant="success">Aktif</Badge>;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "video":
        return "bg-red-500/10 text-red-650 dark:text-red-400";
      case "music":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450";
      case "cloud":
        return "bg-blue-500/10 text-primary dark:text-brand-450";
      case "ai":
        return "bg-purple-500/10 text-purple-650 dark:text-purple-400";
      default:
        return "bg-slate-500/10 text-slate-650 dark:text-slate-400";
    }
  };

  const nameInitial = subscription.name ? subscription.name.charAt(0).toUpperCase() : "S";

  return (
    <div
      className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between h-full select-none text-left relative ${
        isUrgent
          ? "border-red-500 dark:border-red-600 ring-2 ring-red-500/10"
          : "border-slate-200/80 dark:border-slate-800/80"
      }`}
    >
      {isUrgent && (
        <div className="absolute -top-2.5 right-4 bg-red-500 dark:bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-soft-sm animate-pulse">
          <AlertTriangle size={10} /> Yaklaşan Ödeme ({daysRemaining} Gün)
        </div>
      )}

      <div>
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${getCategoryColor(
              subscription.category,
            )}`}
          >
            {nameInitial}
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-850 dark:text-slate-100 tracking-tight leading-tight mb-1">
              {subscription.name}
            </h4>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {subscription.category}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-0.5">
              Aylık Ücret
            </span>
            <span className="text-sm font-black text-slate-850 dark:text-white">
              {formatCurrency(monthlyCost, "TRY")}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-0.5">
              Periyot
            </span>
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-450 uppercase">
              {isYearly ? "Yıllık" : "Aylık"}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-slate-400 dark:text-slate-500">Sonraki Ödeme</span>
            <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Calendar size={12} /> {formattedDate}
            </span>
          </div>
          <div className="flex justify-between text-xs items-center">
            <span className="font-bold text-slate-400 dark:text-slate-500">Ödeme Tipi</span>
            <span className="font-extrabold text-slate-650 dark:text-slate-350">
              {subscription.billingType || "Kredi Kartı"}
            </span>
          </div>
          <div className="flex justify-between text-xs items-center">
            <span className="font-bold text-slate-400 dark:text-slate-500">Durum</span>
            <span className="shrink-0">{getStatusBadge(subscription.status)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => onView(subscription)}
          className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Eye size={14} /> Detayları Gör
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(subscription)}
            className="p-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary/30 dark:hover:text-brand-400 transition-colors cursor-pointer"
            title="Düzenle"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDelete(subscription)}
            className="p-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-colors cursor-pointer"
            title="Sil"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
