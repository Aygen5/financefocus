import React from "react";
import Card from "../ui/Card";
import ProgressBar from "./ProgressBar";

export interface FinancialMetricCardProps {
  title: string;
  value: React.ReactNode;
  description?: string;
  progressValue?: number;
  progressMax?: number;
  progressVariant?: "brand" | "success" | "danger" | "warning";
  className?: string;
}

const FinancialMetricCard: React.FC<FinancialMetricCardProps> = ({
  title,
  value,
  description,
  progressValue,
  progressMax = 100,
  progressVariant = "brand",
  className = "",
}) => {
  const showProgress = progressValue !== undefined;

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-1.5 text-left">
          <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 select-none">
            {title}
          </span>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight leading-none">
            {value}
          </h3>
          {description && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
              {description}
            </p>
          )}
        </div>

        {showProgress && (
          <div className="mt-4 pt-1">
            <ProgressBar
              value={progressValue}
              max={progressMax}
              showPercentage
              variant={progressVariant}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default FinancialMetricCard;
