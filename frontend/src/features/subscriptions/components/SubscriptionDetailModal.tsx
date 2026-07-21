import React from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/financial";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, CreditCard, Shield, RotateCw, AlertCircle, Info } from "lucide-react";
import type { Subscription } from "../subscriptionsSlice";

interface SubscriptionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
}

export const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({
  isOpen,
  onClose,
  subscription,
}) => {
  if (!subscription) return null;

  const formattedNextDate = (() => {
    try {
      return format(parseISO(subscription.nextBillingDate), "dd MMMM yyyy", { locale: tr });
    } catch {
      return subscription.nextBillingDate;
    }
  })();

  const formattedStartDate = (() => {
    if (!subscription.startDate) return "-";
    try {
      return format(parseISO(subscription.startDate), "dd MMMM yyyy", { locale: tr });
    } catch {
      return subscription.startDate;
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

  const cycleLabel = subscription.billingCycle === "yearly" ? "Yıllık" : "Aylık";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Abonelik Detayı" size="md">
      <div className="space-y-6 text-left select-none">
        {/* Header and accent color */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full inline-block shrink-0"
                style={{ backgroundColor: subscription.color || "#004ac6" }}
              />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {subscription.category}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              {subscription.name}
            </h3>
          </div>
          <div className="shrink-0">{getStatusBadge(subscription.status)}</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block mb-0.5">
              Ücret ({cycleLabel})
            </span>
            <span className="text-2xl font-black text-slate-850 dark:text-white">
              {formatCurrency(subscription.cost, "TRY")}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block mb-0.5">
              Aylık Eşdeğer
            </span>
            <span className="text-base font-bold text-slate-650 dark:text-slate-350">
              {formatCurrency(
                subscription.billingCycle === "yearly" ? subscription.cost / 12 : subscription.cost,
                "TRY",
              )}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3.5 border border-slate-200/85 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
            <div className="w-10 h-10 bg-blue-500/10 text-primary dark:text-brand-400 rounded-lg flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                Sonraki Ödeme Tarihi
              </div>
              <div className="text-sm font-extrabold text-slate-850 dark:text-slate-200">
                {formattedNextDate}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 border border-slate-200/85 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-650 dark:text-emerald-450 rounded-lg flex items-center justify-center shrink-0">
              <CreditCard size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                Ödeme Yöntemi
              </div>
              <div className="text-sm font-extrabold text-slate-850 dark:text-slate-200">
                {subscription.billingType || "Belirtilmemiş"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 border border-slate-200/85 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
            <div className="w-10 h-10 bg-purple-500/10 text-purple-650 dark:text-purple-400 rounded-lg flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                Başlangıç Tarihi
              </div>
              <div className="text-sm font-extrabold text-slate-850 dark:text-slate-200">
                {formattedStartDate}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 border border-slate-200/85 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-600 dark:text-amber-450 rounded-lg flex items-center justify-center shrink-0">
              <RotateCw size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                Otomatik Yenileme
              </div>
              <div className="text-sm font-extrabold text-slate-850 dark:text-slate-200 flex items-center gap-1">
                <Shield
                  size={14}
                  className={subscription.autoRenew ? "text-emerald-500" : "text-slate-400"}
                />
                {subscription.autoRenew ? "Evet" : "Hayır"}
              </div>
            </div>
          </div>
        </div>

        {!subscription.autoRenew && subscription.status === "active" && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-850 dark:text-amber-400 p-3.5 rounded-xl flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="text-[11px] font-bold">
              Bu aboneliğin otomatik yenilemesi kapalıdır. {formattedNextDate} tarihinde iptal
              olacaktır.
            </div>
          </div>
        )}

        {subscription.notes && (
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-1.5 flex items-center gap-1">
              <Info size={12} /> Açıklama & Notlar
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
              {subscription.notes}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SubscriptionDetailModal;
