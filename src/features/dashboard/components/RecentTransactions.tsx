import React from "react";
import { Link } from "react-router-dom";
import DataTable from "@/components/display/DataTable";
import type { Column } from "@/components/display/DataTable";
import Badge from "@/components/display/Badge";
import CurrencyDisplay from "@/components/display/CurrencyDisplay";
import type { Transaction } from "@/features/transactions/transactionsSlice";

export interface RecentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  loading = false,
}) => {
  const columns: Column<Transaction>[] = [
    {
      key: "date",
      header: "Tarih",
      render: (row) => {
        try {
          return new Date(row.date).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        } catch {
          return row.date;
        }
      },
    },
    {
      key: "description",
      header: "Açıklama",
      render: (row) => <span className="font-semibold">{row.description}</span>,
    },
    {
      key: "category",
      header: "Kategori",
      render: (row) => {
        const getCategoryVariant = (cat: string) => {
          switch (cat.toLowerCase()) {
            case "maaş":
              return "success";
            case "market":
              return "brand";
            case "fatura":
              return "danger";
            default:
              return "neutral";
          }
        };
        return <Badge variant={getCategoryVariant(row.category)}>{row.category}</Badge>;
      },
    },
    {
      key: "amount",
      header: "Tutar",
      className: "text-right",
      render: (row) => (
        <CurrencyDisplay
          amount={row.type === "expense" ? -row.amount : row.amount}
          type={row.type}
          colored
        />
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 shadow-soft-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
          Son İşlemler
        </h3>
        <Link
          to="/transactions"
          className="font-label-md text-label-md text-primary hover:underline"
        >
          Tümünü Gör
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        loading={loading}
        emptyTitle="İşlem Bulunamadı"
        emptyDescription="Yakın zamanda gerçekleştirilmiş herhangi bir işlem kaydı bulunmamaktadır."
        className="border-0 shadow-none rounded-none"
      />
    </div>
  );
};

export default RecentTransactions;
