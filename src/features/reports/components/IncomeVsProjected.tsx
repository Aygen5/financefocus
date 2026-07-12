import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/utils/financial";

import { useAppSelector } from "@/store";
import { selectThemeMode } from "@/store/themeSlice";

export interface IncomeVsProjectedPoint {
  month: string;
  income: number;
  projected: number;
}

export interface IncomeVsProjectedProps {
  data: IncomeVsProjectedPoint[];
  loading?: boolean;
}

const IncomeVsProjected: React.FC<IncomeVsProjectedProps> = ({ data, loading = false }) => {
  const [range, setRange] = useState<"6M" | "1Y" | "ALL">("6M");
  const themeMode = useAppSelector(selectThemeMode);

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
    return <div className="h-96 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-left h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold">
              Gelir ve Tahmin Karşılaştırması
            </h4>
            <p className="text-xs font-semibold text-slate-455 mt-1">
              Son 6 aydaki gelir performansı
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-lg">
            {(["6M", "1Y", "ALL"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-all cursor-pointer ${
                  range === r
                    ? "bg-white dark:bg-slate-900 text-primary dark:text-brand-400 shadow-soft-sm font-bold"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium"
                }`}
              >
                {r === "6M" ? "6 Ay" : r === "1Y" ? "1 Yıl" : "Tümü"}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-60 w-full relative -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#004ac6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#004ac6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }}
                tickFormatter={(val) => `₺${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => [`₺${Number(value).toLocaleString()}`, "Gelir"]}
                contentStyle={{
                  background: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "8px",
                  color: tooltipColor,
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#004ac6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#incomeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-4">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Toplam Gelir
          </p>
          <p className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-extrabold">
            {formatCurrency(510000, "TRY", "tr-TR")}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Aylık Ortalama
          </p>
          <p className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-extrabold">
            {formatCurrency(85000, "TRY", "tr-TR")}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Büyüme Oranı
          </p>
          <p className="font-headline-sm text-headline-sm text-primary dark:text-brand-400 font-extrabold">
            +15.4%
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomeVsProjected;
