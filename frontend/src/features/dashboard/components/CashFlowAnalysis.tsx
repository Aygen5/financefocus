import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "@/components/ui/Card";
import { MoreHorizontal, BarChart2 } from "lucide-react";

import { useAppSelector } from "@/store";
import { selectThemeMode } from "@/store/themeSlice";

export interface CashFlowData {
  month: string;
  income: number;
  expense: number;
}

export interface CashFlowAnalysisProps {
  data: CashFlowData[];
  loading?: boolean;
}

const CashFlowAnalysis: React.FC<CashFlowAnalysisProps> = ({ data, loading = false }) => {
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

  const hasData = React.useMemo(() => {
    return data && data.length > 0 && data.some((d) => (d.income || 0) > 0 || (d.expense || 0) > 0);
  }, [data]);

  const gridColor = isDark ? "#1e293b" : "#e2e8f0";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipColor = isDark ? "#f8fafc" : "#0f172a";
  const tooltipBorder = isDark ? "#1e293b" : "#e2e8f0";

  return (
    <Card
      title="Nakit Akış Analizi"
      extra={
        <button className="text-on-surface-variant hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors">
          <MoreHorizontal size={18} />
        </button>
      }
      className="w-full"
    >
      {loading ? (
        <div className="h-64 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      ) : !hasData ? (
        <div className="h-64 w-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 text-primary dark:text-brand-400 flex items-center justify-center mb-3">
            <BarChart2 size={24} />
          </div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">
            Henüz veri bulunmuyor
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
            İlk işleminizi eklediğinizde nakit akışı burada görüntülenecektir.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: -20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
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
              />
              <Tooltip
                contentStyle={{
                  background: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "8px",
                  color: tooltipColor,
                  fontSize: "12px",
                }}
                cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)" }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingBottom: "20px",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              />
              <Bar
                name="Gelir"
                dataKey="income"
                fill="#0053db"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                name="Gider"
                dataKey="expense"
                fill="#b7c8e1"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default CashFlowAnalysis;
