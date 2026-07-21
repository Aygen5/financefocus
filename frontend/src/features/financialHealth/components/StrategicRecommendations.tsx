import React from "react";
import { Lightbulb, CalendarRange, TrendingUp, Wallet, ArrowRight } from "lucide-react";

export interface StrategicRecommendationsProps {
  onAction?: (actionName: string) => void;
}

const StrategicRecommendations: React.FC<StrategicRecommendationsProps> = ({ onAction }) => {
  const list = [
    {
      title: "Subscription Optimization",
      points: "+4 Points",
      description:
        "Eğlence kategorinizde 3 mükerrer abonelik tespit ettik. Bunları birleştirmek aylık $42 tasarruf sağlayabilir.",
      actionLabel: "Optimize Now",
      icon: <CalendarRange size={22} />,
      color: "bg-blue-500/10 text-primary dark:text-brand-400",
    },
    {
      title: "Portfolio Rebalancing",
      points: "+2 Points",
      description:
        "Mevcut hisse senedi maruziyetiniz hedef risk profilinizin %7 üzerindedir. Dengeleme yapmayı düşünün.",
      actionLabel: "Review Portfolio",
      icon: <TrendingUp size={22} />,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "Yield Optimization",
      points: "+3 Points",
      description:
        "Standart bir tasarruf hesabında $12,500'iniz var. Bunu yüksek getirili bir fona taşımak yılda $500 kazandırabilir.",
      actionLabel: "Compare Rates",
      icon: <Wallet size={22} />,
      color: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-stack-md text-left">
      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
        <Lightbulb size={20} className="text-primary dark:text-brand-400" />
        <h3 className="font-headline-sm text-headline-sm">
          Stratejik Öneriler (Strategic Recommendations)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {list.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onAction?.(item.title)}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 space-y-4 hover:border-primary dark:hover:border-brand-500 hover:shadow-soft-md transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color}`}
                >
                  {item.icon}
                </div>
                <span className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold px-3 py-1 rounded-full text-xs">
                  {item.points}
                </span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-brand-400 transition-colors mt-4 font-bold">
                {item.title}
              </h4>
              <p className="font-body-sm text-body-sm text-slate-400 dark:text-slate-500 mt-2 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between font-bold text-sm text-primary dark:text-brand-400">
              <span>{item.actionLabel}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategicRecommendations;
