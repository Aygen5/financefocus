import React from "react";
import ProgressBar from "@/components/display/ProgressBar";
import Button from "@/components/ui/Button";

export interface ComponentAnalysisProps {
  savingsRatio: number;
  debtToIncome: number;
  budgetVariance: number;
  subscriptionLeakage: number;
  netWorthVelocity: number;
  onViewMetrics?: () => void;
  loading?: boolean;
}

const ComponentAnalysis: React.FC<ComponentAnalysisProps> = ({
  savingsRatio,
  debtToIncome,
  budgetVariance,
  subscriptionLeakage,
  netWorthVelocity,
  onViewMetrics,
  loading = false,
}) => {
  if (loading) {
    return <div className="h-80 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;
  }

  const items = [
    { label: "Savings Ratio", value: savingsRatio, max: 100 },
    { label: "Debt-to-Income", value: debtToIncome, max: 100 },
    { label: "Budget Variance", value: budgetVariance, max: 100 },
    { label: "Subscription Leakage", value: subscriptionLeakage, max: 100 },
    { label: "Net Worth Velocity", value: netWorthVelocity, max: 100 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-8 flex flex-col justify-between shadow-soft-sm text-left h-full">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold mb-6">
          Bileşen Analizi (Component Analysis)
        </h3>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-500">{item.label}</span>
                <span className="text-slate-800 dark:text-white font-bold">
                  {item.value}/{item.max}
                </span>
              </div>
              <ProgressBar value={item.value} max={item.max} variant="brand" />
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={onViewMetrics} className="mt-8 w-full font-bold">
        Detaylı Metrikleri Görüntüle
      </Button>
    </div>
  );
};

export default ComponentAnalysis;
