import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { useAppSelector } from "@/store";
import { selectThemeMode } from "@/store/themeSlice";

export interface HealthTrendPoint {
  month: string;
  score: number;
}

export interface HistoricalHealthTrendProps {
  data: HealthTrendPoint[];
  loading?: boolean;
}

const HistoricalHealthTrend: React.FC<HistoricalHealthTrendProps> = ({ data, loading = false }) => {
  const themeMode = useAppSelector(selectThemeMode);

  // Resolve dark condition dynamically
  const isDark = React.useMemo(() => {
    if (themeMode === "dark") return true;
    if (themeMode === "system") {
      return (
        typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return false;
  }, [themeMode]);

  const gridColor = isDark ? "#1e293b" : "#e2e8f0";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipColor = isDark ? "#f8fafc" : "#0f172a";
  const tooltipBorder = isDark ? "#1e293b" : "#e2e8f0";

  if (loading) {
    return <div className="h-72 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-8 shadow-soft-sm text-left h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold">
          Finansal Sağlık Trendi
        </h3>
        <div className="flex gap-2 text-xs font-semibold select-none">
          <span className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-slate-500">
            6 Aylık
          </span>
          <span className="px-2 py-1 rounded text-slate-400">1 Yıllık</span>
        </div>
      </div>

      <div className="h-60 w-full relative -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }}
            />
            <Tooltip
              formatter={(value) => [`${value} Puan`, "Skor"]}
              contentStyle={{
                background: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "8px",
                color: tooltipColor,
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
