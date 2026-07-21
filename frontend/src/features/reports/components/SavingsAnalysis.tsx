import React from "react";
import ProgressBar from "@/components/display/ProgressBar";
import { Lightbulb } from "lucide-react";

export interface SavingsAnalysisProps {
  retirement: number;
  emergency: number;
  realEstate: number;
  loading?: boolean;
}

const SavingsAnalysis: React.FC<SavingsAnalysisProps> = ({
  retirement,
  emergency,
  realEstate,
  loading = false,
}) => {
  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-left h-full flex flex-col justify-between">
      <div>
        <h4 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold mb-6">
          Savings Analysis
        </h4>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-slate-500">Retirement Fund</span>
              <span className="text-slate-800 dark:text-white font-bold">%{retirement}</span>
            </div>
            <ProgressBar value={retirement} max={100} variant="brand" />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-slate-500">Emergency Savings</span>
              <span className="text-slate-800 dark:text-white font-bold">%{emergency}</span>
            </div>
            <ProgressBar value={emergency} max={100} variant="success" />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-slate-500">Real Estate Investment</span>
              <span className="text-slate-800 dark:text-white font-bold">%{realEstate}</span>
            </div>
            <ProgressBar value={realEstate} max={100} variant="warning" />
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200/50 dark:border-slate-800 border-dashed mt-8 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <Lightbulb size={20} />
        </div>
        <div>
          <p className="font-label-md text-label-md text-slate-800 dark:text-white font-bold">
            Smart Tip
          </p>
          <p className="text-body-sm text-body-sm text-slate-400 dark:text-slate-500 leading-relaxed mt-1 font-medium">
            Emeklilik katkı payınızı %2 artırmak, 10 yıllık vadede vergi muafiyetiyle $45k
            biriktirmenizi sağlayabilir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavingsAnalysis;
