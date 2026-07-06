import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/utils/styles";

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  change?: number; // e.g. 12.5 for +12.5%, -3.4 for -3.4%
  changeLabel?: string; // e.g. "geçen aya göre"
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  loading = false,
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isZero = change !== undefined && change === 0;

  return (
    <Card className="relative overflow-hidden w-full text-left">
      <div className="p-6">
        <div className="flex items-center justify-between select-none">
          <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">
            {title}
          </span>
          {icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-350 shrink-0">
              {icon}
            </div>
          )}
        </div>

        {loading ? (
          <div className="mt-4 space-y-2">
            <Skeleton variant="text" className="h-7 w-2/3" />
            <Skeleton variant="text" className="h-4 w-1/2" />
          </div>
        ) : (
          <div className="mt-3.5">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight leading-none">
              {value}
            </h2>

            {change !== undefined && (
              <div className="mt-3 flex items-center gap-1.5 select-none">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 text-[11px] font-bold",
                    isPositive &&
                      "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450",
                    isNegative && "bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-450",
                    isZero && "bg-slate-50 dark:bg-slate-800 text-slate-500",
                  )}
                >
                  {isPositive && <TrendingUp size={12} />}
                  {isNegative && <TrendingDown size={12} />}
                  {isZero && <Minus size={12} />}
                  {isPositive ? "+" : ""}
                  {change}%
                </span>
                {changeLabel && (
                  <span className="text-[11px] text-slate-450 dark:text-slate-500 font-medium">
                    {changeLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
