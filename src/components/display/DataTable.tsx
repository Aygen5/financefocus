import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import LoadingSpinner from "../feedback/LoadingSpinner";
import EmptyState from "../feedback/EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  className?: string;
}

function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  emptyTitle = "Kayıt Bulunamadı",
  emptyDescription = "Gösterilecek herhangi bir veri mevcut değil.",
  sortKey,
  sortDirection,
  onSort,
  className = "",
}: DataTableProps<T>) {
  const showEmpty = !loading && data.length === 0;

  return (
    <div
      className={`w-full overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-soft-sm ${className}`}
    >
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60 select-none">
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    onClick={() => col.sortable && onSort?.(col.key)}
                    className={`px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider ${
                      col.sortable
                        ? "cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                        : ""
                    } ${col.className || ""}`}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.header}
                      {col.sortable && (
                        <span className="text-slate-400">
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <ArrowUp size={12} />
                            ) : (
                              <ArrowDown size={12} />
                            )
                          ) : (
                            <ArrowUpDown size={12} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12">
                  <LoadingSpinner label="Veriler yükleniyor..." />
                </td>
              </tr>
            )}

            {showEmpty && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 text-slate-700 dark:text-slate-300 font-medium ${col.className || ""}`}
                    >
                      {col.render
                        ? col.render(row, rowIndex)
                        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
