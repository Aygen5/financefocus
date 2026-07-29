import React from "react";
import { Link } from "react-router-dom";
import DataTable from "@/components/display/DataTable";
import type { Column } from "@/components/display/DataTable";
import Badge from "@/components/display/Badge";
import CurrencyDisplay from "@/components/display/CurrencyDisplay";
import type { Transaction } from "@/features/transactions/transactionsSlice";
import { Receipt, Plus } from "lucide-react";

import { getTransactionTypeInfo } from "@/utils/financialMath";

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
      render: (row) => {
        const info = getTransactionTypeInfo(row.transactionType, row.amount);
        return <CurrencyDisplay amount={info.signedAmount} type={info.type} colored />;
      },
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

      {!loading && transactions.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
            <Receipt size={24} />
          </div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">
            Herhangi bir işlem bulunamadı.
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
            İlk gelirinizi veya giderinizi ekleyerek finansal takibe başlayın.
          </p>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary dark:bg-brand-500 text-white font-bold text-xs hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={14} />
            <span>İlk İşlemi Ekle</span>
          </Link>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={transactions}
          loading={loading}
          emptyTitle="Herhangi bir işlem bulunamadı."
          emptyDescription="İlk gelirinizi veya giderinizi ekleyerek finansal takibe başlayın."
          className="border-0 shadow-none rounded-none"
        />
      )}
    </div>
  );
};

export default RecentTransactions;
