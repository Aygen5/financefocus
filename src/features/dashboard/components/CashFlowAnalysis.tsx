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
import { MoreHorizontal } from "lucide-react";

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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                cursor={{ fill: "rgba(0, 0, 0, 0.02)" }}
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
