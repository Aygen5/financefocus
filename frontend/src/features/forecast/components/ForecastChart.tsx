import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import Card from "@/components/ui/Card";

import { useAppSelector } from "@/store";
import { selectThemeMode } from "@/store/themeSlice";

export interface ForecastPoint {
  year: number;
  historical?: number;
  projected?: number;
}

export interface ForecastChartProps {
  data: ForecastPoint[];
  loading?: boolean;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data, loading = false }) => {
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
  const referenceLineColor = isDark ? "#475569" : "#cbd5e1";

  if (loading) {
    return <div className="h-[400px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;
  }

  return (
    <Card
      title="Net Varlık Projeksiyonu"
      extra={
        <div className="flex items-center gap-4 text-xs font-semibold select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
            <span className="text-slate-500">Geçmiş Dönem</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-slate-500">Yapay Zeka Tahmini</span>
          </div>
        </div>
      }
      className="w-full flex flex-col min-h-[400px]"
    >
      <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2 mb-6 font-medium text-left">
        Geçmiş finansal performansınız ve AI büyüme projeksiyonu karşılaştırması
      </p>

      <div className="flex-1 w-full h-64 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0053db" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0053db" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }}
              tickFormatter={(val) => {
                if (val >= 1000000) return `₺${val / 1000000}M`;
                if (val >= 1000) return `₺${val / 1000}k`;
                return `₺${val}`;
              }}
            />
            <Tooltip
              formatter={(value) => [`₺${Number(value).toLocaleString()}`, "Tutar"]}
              contentStyle={{
                background: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "8px",
                color: tooltipColor,
                fontSize: "12px",
              }}
            />

            <ReferenceLine
              x={2024}
              stroke={referenceLineColor}
              strokeDasharray="3 3"
              label={{
                value: "BUGÜN",
                position: "top",
                fill: "#0053db",
                fontSize: 10,
                fontWeight: "bold",
              }}
            />

            <Area
              type="monotone"
              dataKey="historical"
              stroke="#64748b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorHistorical)"
            />

            <Area
              type="monotone"
              dataKey="projected"
              stroke="#0053db"
              strokeWidth={3}
              strokeDasharray="5 5"
              fillOpacity={1}
              fill="url(#colorProjected)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ForecastChart;
