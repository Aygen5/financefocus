import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export interface HealthTrendPoint {
  month: string;
  score: number;
}

export interface HistoricalHealthTrendProps {
  data: HealthTrendPoint[];
  loading?: boolean;
}

const HistoricalHealthTrend: React.FC<HistoricalHealthTrendProps> = ({ data, loading = false }) => {
  if (loading) {
    return <div className="h-72 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-8 shadow-soft-sm text-left h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold">
          Historical Health Trend
        </h3>
        <div className="flex gap-2 text-xs font-semibold select-none">
          <span className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-slate-500">
            6 Months
          </span>
          <span className="px-2 py-1 rounded text-slate-400">1 Year</span>
        </div>
      </div>

      <div className="h-60 w-full relative -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
            />
            <Tooltip
              formatter={(value) => [`${value} Puan`, "Skor"]}
              contentStyle={{
                background: "#1e293b",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="score" fill="#004ac6" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoricalHealthTrend;
