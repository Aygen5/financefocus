import React from "react";
import {
  ReceiptText,
  CreditCard,
  Sparkles,
  Settings,
  FileText,
  Share2,
  Eye,
  History,
} from "lucide-react";
import type { ActivityLog } from "../activitySlice";
import ProgressBar from "@/components/display/ProgressBar";
import Button from "@/components/ui/Button";

export interface ActivityTimelineProps {
  logs: ActivityLog[];
  loading?: boolean;
  onLoadArchive?: () => void;
  onViewReport?: (id: string) => void;
  onShareReport?: (id: string) => void;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  logs,
  loading = false,
  onLoadArchive,
  onViewReport,
  onShareReport,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  // İkon seçme helper'ı
  const getActivityIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "transaction":
      case "transactions":
        return <ReceiptText size={20} className="text-primary" />;
      case "budget":
      case "budgets":
        return <CreditCard size={20} className="text-slate-650" />;
      case "goal":
      case "goals":
        return <Sparkles size={20} className="text-amber-600" />;
      case "report":
      case "reports":
        return <FileText size={20} className="text-emerald-650" />;
      default:
        return <Settings size={20} className="text-slate-400" />;
    }
  };

  // Zaman tüneli için tarihlere göre gruplama (örn. Today, Yesterday, This Week)
  const groupedLogs = logs.reduce<Record<string, ActivityLog[]>>((groups, log) => {
    const label = log.timeLabel || "Diğer Aktiviteler";
    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(log);
    return groups;
  }, {});

  return (
    <div className="space-y-stack-lg text-left">
      {Object.entries(groupedLogs).map(([label, items]) => (
        <section key={label}>
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-6 select-none">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{label}</h4>
            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-850" />
          </div>

          <div className="space-y-6 ml-4">
            {items.map((log, idx) => {
              const isReport = log.category?.toLowerCase() === "report";
              const isBudget = log.category?.toLowerCase() === "budget" && log.meta?.progress;

              return (
                <div key={log.id} className="flex gap-6 relative">
                  {/* Left Timeline vertical line indicator */}
                  {idx < items.length - 1 && (
                    <div className="absolute left-[19px] top-8 bottom-[-32px] w-[2px] bg-slate-200 dark:bg-slate-800 opacity-40" />
                  )}

                  {/* Left circular icon */}
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-850 flex items-center justify-center border border-slate-200 dark:border-slate-800 z-10 shrink-0">
                    {getActivityIcon(log.category || "")}
                  </div>

                  {/* Right Detail bubble */}
                  <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 hover:shadow-soft-md transition-all group">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-headline-sm text-sm text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-brand-400 transition-colors font-bold leading-tight">
                        {log.action}
                      </h5>
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400 leading-relaxed">
                      {log.details}
                    </p>

                    {/* Transaction metadata tags */}
                    {log.meta?.idLabel && (
                      <div className="mt-3 flex items-center gap-2 font-semibold text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/20 text-primary dark:text-brand-400 uppercase tracking-wider">
                          {log.meta.idLabel}
                        </span>
                        {log.meta.userName && (
                          <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {log.meta.userName}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Budget Progress bar */}
                    {isBudget && log.meta?.progress && (
                      <div className="mt-3">
                        <ProgressBar value={log.meta.progress} max={100} variant="brand" />
                      </div>
                    )}

                    {/* Report actions buttons */}
                    {isReport && (
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Eye size={14} />}
                          onClick={() => onViewReport?.(log.id)}
                        >
                          View Report
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Share2 size={14} />}
                          onClick={() => onShareReport?.(log.id)}
                        >
                          Share
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* End of recent history loader block */}
      <div className="flex flex-col items-center py-10">
        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4 text-slate-400">
          <History size={20} />
        </div>
        <h5 className="font-headline-sm text-slate-800 dark:text-white font-bold">
          End of recent history
        </h5>
        <p className="font-body-sm text-slate-500 mt-1 mb-6 font-medium">
          30 günden eski aktiviteleri görüntülemek için arşiv erişimi gereklidir.
        </p>
        <Button variant="outline" onClick={onLoadArchive}>
          Arşivi Yükle (Load Archive)
        </Button>
      </div>
    </div>
  );
};

export default ActivityTimeline;
