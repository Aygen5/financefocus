import React from "react";
import DataTable from "@/components/display/DataTable";
import type { Column } from "@/components/display/DataTable";
import Badge from "@/components/display/Badge";
import { TrendingUp, TrendingDown, Minus, Download } from "lucide-react";
import { formatCurrency } from "@/utils/financial";

export interface AssetHolding {
  symbol: string;
  name: string;
  shares: string;
  category: string;
  value: number;
  change24h: number;
  allocation: number;
}

export interface HoldingsTableProps {
  assets: AssetHolding[];
  loading?: boolean;
  onExport?: () => void;
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ assets, loading = false, onExport }) => {
  const columns: Column<AssetHolding>[] = [
    {
      key: "symbol",
      header: "Varlık",
      render: (row) => {
        const getLogoColor = (cat: string) => {
          switch (cat.toLowerCase()) {
            case "equities":
            case "hisse":
              return "bg-blue-500/10 text-primary dark:text-brand-450";
            case "cash":
            case "nakit":
              return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450";
            case "crypto":
            case "kripto":
              return "bg-slate-500/10 text-slate-600 dark:text-slate-450";
            default:
              return "bg-brand-500/10 text-brand-600 dark:text-brand-450";
          }
        };

        return (
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded flex items-center justify-center font-bold text-sm ${getLogoColor(
                row.category,
              )}`}
            >
              {row.symbol}
            </div>
            <div>
              <div className="font-label-md text-label-md text-slate-800 dark:text-slate-200">
                {row.name}
              </div>
              <div className="font-body-sm text-body-sm text-slate-400 dark:text-slate-500">
                {row.shares}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "category",
      header: "Kategori",
      render: (row) => {
        const getCategoryVariant = (cat: string) => {
          switch (cat.toLowerCase()) {
            case "equities":
              return "brand";
            case "cash":
              return "success";
            case "crypto":
              return "neutral";
            default:
              return "neutral";
          }
        };
        return <Badge variant={getCategoryVariant(row.category)}>{row.category}</Badge>;
      },
    },
    {
      key: "value",
      header: "Güncel Değer",
      className: "text-right",
      render: (row) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {formatCurrency(row.value, "USD", "en-US")}
        </span>
      ),
    },
    {
      key: "change24h",
      header: "24s Değişim",
      className: "text-right",
      render: (row) => {
        const isUp = row.change24h > 0;
        const isZero = row.change24h === 0;

        if (isZero) {
          return (
            <span className="inline-flex items-center gap-1 font-semibold text-slate-400 dark:text-slate-500 justify-end w-full">
              <Minus size={14} /> 0.0%
            </span>
          );
        }

        return (
          <span
            className={`inline-flex items-center gap-1 font-semibold justify-end w-full ${
              isUp ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isUp ? "+" : ""}
            {row.change24h}%
          </span>
        );
      },
    },
    {
      key: "allocation",
      header: "Dağılım",
      className: "text-right font-semibold text-slate-800 dark:text-slate-200",
      render: (row) => `%${row.allocation}`,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-soft-sm overflow-hidden text-left">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
        <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
          Portföy Detayları
        </h3>
        <button
          onClick={onExport}
          className="text-primary font-label-md hover:underline transition-colors flex items-center gap-1 cursor-pointer"
        >
          Dışa Aktar <Download size={14} />
        </button>
      </div>

      <DataTable
        columns={columns}
        data={assets}
        loading={loading}
        emptyTitle="Varlık Bulunamadı"
        emptyDescription="Portföyünüzde henüz kayıtlı bir varlık bulunmamaktadır."
        className="border-0 shadow-none rounded-none"
      />
    </div>
  );
};

export default HoldingsTable;
