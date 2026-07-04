import React from "react";
import DataTable from "@/components/display/DataTable";
import type { Column } from "@/components/display/DataTable";
import Badge from "@/components/display/Badge";
import { Download, FileText, TableProperties, LineChart } from "lucide-react";
import type { FinancialReport } from "../reportsSlice";

export interface RecentReportsTableProps {
  reports: FinancialReport[];
  loading?: boolean;
  onDownload?: (id: string) => void;
  onViewAll?: () => void;
}

const RecentReportsTable: React.FC<RecentReportsTableProps> = ({
  reports,
  loading = false,
  onDownload,
  onViewAll,
}) => {
  const columns: Column<FinancialReport>[] = [
    {
      key: "name",
      header: "Rapor Adı",
      render: (row) => {
        const getIcon = (type: string) => {
          switch (type.toLowerCase()) {
            case "pdf document":
            case "pdf":
              return <FileText size={18} className="text-red-500" />;
            case "excel sheet":
            case "excel":
              return <TableProperties size={18} className="text-emerald-600" />;
            default:
              return <LineChart size={18} className="text-primary" />;
          }
        };

        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200/40 dark:border-slate-800">
              {getIcon(row.type)}
            </div>
            <span className="font-semibold text-slate-800 dark:text-white">{row.name}</span>
          </div>
        );
      },
    },
    {
      key: "date",
      header: "Oluşturma Tarihi",
      render: (row) => {
        try {
          const date = new Date(row.date);
          return (
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              {date.toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          );
        } catch {
          return <span className="text-slate-400 dark:text-slate-500 font-medium">{row.date}</span>;
        }
      },
    },
    {
      key: "type",
      header: "Format",
      render: (row) => {
        const isPdf = row.type.toLowerCase().includes("pdf");
        const isExcel =
          row.type.toLowerCase().includes("excel") || row.type.toLowerCase().includes("sheet");
        return (
          <Badge variant={isPdf ? "brand" : isExcel ? "success" : "neutral"}>{row.type}</Badge>
        );
      },
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <button
          onClick={() => onDownload?.(row.id)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer"
        >
          <Download size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden text-left h-full flex flex-col justify-between">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
        <h4 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold">
          Recent Generated Reports
        </h4>
        <button
          onClick={onViewAll}
          className="text-xs font-extrabold text-primary dark:text-brand-400 hover:underline cursor-pointer"
        >
          Tümünü Gör
        </button>
      </div>

      <div className="flex-1">
        <DataTable
          columns={columns}
          data={reports}
          loading={loading}
          className="border-0 shadow-none rounded-none"
        />
      </div>
    </div>
  );
};

export default RecentReportsTable;
