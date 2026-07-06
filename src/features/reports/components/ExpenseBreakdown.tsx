import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/financial";

export interface ExpenseBreakdownItem {
  name: string;
  value: number;
  color: string;
}

export interface ExpenseBreakdownProps {
  data: ExpenseBreakdownItem[];
  loading?: boolean;
}

const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ data, loading = false }) => {
  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;
  }

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col h-full text-left">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold">
          Harcama Kırılımı
        </h4>
      </div>

      {/* Donut Chart */}
      <div className="relative h-56 w-full mb-6 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Inner Label */}
        <div className="absolute text-center select-none">
          <span className="font-display-lg text-display-lg text-slate-800 dark:text-white font-extrabold leading-none">
            42%
          </span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Barınma</p>
        </div>
      </div>

      {/* Detail list */}
      <div className="space-y-4 flex-1">
        {data.map((item, index) => {
          const ratio = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
          return (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-body-sm text-body-sm text-slate-650 dark:text-slate-350">
                  {item.name}
                </span>
              </div>
              <span className="font-label-md text-label-md text-slate-800 dark:text-slate-200">
                {formatCurrency(item.value, "TRY", "tr-TR")} ({Math.round(ratio)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseBreakdown;
