import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/financial";

export interface AllocationItem {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface AllocationChartProps {
  data: AllocationItem[];
  totalValue: number;
  loading?: boolean;
}

const AllocationChart: React.FC<AllocationChartProps> = ({ data, totalValue, loading = false }) => {
  if (loading) {
    return <div className="h-64 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 shadow-soft-sm flex flex-col md:flex-row items-center gap-8 text-left">
      {/* Recharts Pie Chart */}
      <div className="w-48 h-48 relative flex-shrink-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
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
          <div className="font-label-sm text-label-sm text-slate-400 dark:text-slate-500">
            Toplam Varlık
          </div>
          <div className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-extrabold mt-0.5">
            {formatCurrency(totalValue, "TRY", "tr-TR")}
          </div>
        </div>
      </div>

      {/* Allocation List */}
      <div className="flex-1 w-full">
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold mb-6">
          Varlık Dağılımı (Asset Allocation)
        </h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-body-sm text-body-sm text-slate-700 dark:text-slate-300">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-label-md text-label-md text-slate-800 dark:text-slate-200">
                  {formatCurrency(item.value, "TRY", "tr-TR")}
                </span>
                <span className="font-label-sm text-label-sm bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 dark:text-slate-400 w-12 text-center font-bold">
                  %{item.percentage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllocationChart;
