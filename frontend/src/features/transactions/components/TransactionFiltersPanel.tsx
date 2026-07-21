import React, { useId } from "react";
import type { TransactionFilters } from "../types/transactions.types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";

export interface TransactionFiltersPanelProps {
  filters: TransactionFilters;
  activeFiltersCount: number;
  onFilterChange: (newFilters: Partial<TransactionFilters>) => void;
  onReset: () => void;
}

export const TransactionFiltersPanel: React.FC<TransactionFiltersPanelProps> = ({
  filters,
  activeFiltersCount,
  onFilterChange,
  onReset,
}) => {
  const transactionTypeSelectId = useId();
  const categorySelectId = useId();
  const dateRangeSelectId = useId();
  const statusSelectId = useId();

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ transactionType: e.target.value as TransactionFilters["transactionType"] });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ category: e.target.value });
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const range = e.target.value as TransactionFilters["dateRange"];
    onFilterChange({
      dateRange: range,
      // Eğer custom değilse tarih alanlarını temizle
      ...(range !== "custom" ? { customMinDate: "", customMaxDate: "" } : {}),
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: e.target.value as TransactionFilters["status"] });
  };

  const handleMinAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : undefined;
    onFilterChange({ minAmount: val });
  };

  const handleMaxAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : undefined;
    onFilterChange({ maxAmount: val });
  };

  const handleCustomMinDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ customMinDate: e.target.value });
  };

  const handleCustomMaxDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ customMaxDate: e.target.value });
  };

  // Kategoriler Listesi
  const categories = [
    { value: "all", label: "Tüm Kategoriler" },
    { value: "Salary", label: "Maaş" },
    { value: "Freelance", label: "Serbest Çalışma" },
    { value: "Food", label: "Gıda / Yemek" },
    { value: "Shopping", label: "Alışveriş" },
    { value: "Transportation", label: "Ulaşım" },
    { value: "Bills", label: "Faturalar" },
    { value: "Entertainment", label: "Eğlence" },
    { value: "Investment", label: "Yatırım" },
    { value: "Healthcare", label: "Sağlık" },
    { value: "Education", label: "Eğitim" },
    { value: "Other", label: "Diğer" },
  ];

  // Tarih Aralığı Seçenekleri
  const dateRanges = [
    { value: "all", label: "Tüm Zamanlar" },
    { value: "today", label: "Bugün" },
    { value: "last7days", label: "Son 7 Gün" },
    { value: "thismonth", label: "Bu Ay" },
    { value: "last3months", label: "Son 3 Ay" },
    { value: "thisyear", label: "Bu Yıl" },
    { value: "custom", label: "Özel Aralık" },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 mb-6 text-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/60 select-none">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Detaylı Filtreleme
          </h3>
          {activeFiltersCount > 0 && (
            <span className="bg-primary/10 dark:bg-brand-500/10 text-primary dark:text-brand-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              {activeFiltersCount} Aktif Filtre
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            icon={<RotateCcw size={13} />}
            onClick={onReset}
            className="text-[11px] h-auto p-1 font-bold text-red-500 hover:text-red-600 dark:text-red-400"
          >
            Temizle
          </Button>
        )}
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* İşlem Türü */}
        <Select
          id={transactionTypeSelectId}
          label="İşlem Türü"
          value={filters.transactionType}
          onChange={handleTypeChange}
          options={[
            { value: "all", label: "Hepsi" },
            { value: "income", label: "Gelir" },
            { value: "expense", label: "Gider" },
            { value: "neutral", label: "Nötr (Transfer)" },
          ]}
        />

        {/* Kategori */}
        <Select
          id={categorySelectId}
          label="Kategori"
          value={filters.category}
          onChange={handleCategoryChange}
          options={categories}
        />

        {/* Durum */}
        <Select
          id={statusSelectId}
          label="Durum"
          value={filters.status}
          onChange={handleStatusChange}
          options={[
            { value: "all", label: "Hepsi" },
            { value: "completed", label: "Tamamlandı" },
            { value: "pending", label: "Beklemede" },
            { value: "failed", label: "Başarısız" },
          ]}
        />

        {/* Tarih Aralığı */}
        <Select
          id={dateRangeSelectId}
          label="Tarih Aralığı"
          value={filters.dateRange}
          onChange={handleDateRangeChange}
          options={dateRanges}
        />

        {/* Tutar Aralığı (Min / Max) */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              label="Min Tutar"
              type="number"
              placeholder="Min"
              value={filters.minAmount ?? ""}
              onChange={handleMinAmountChange}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Max Tutar"
              type="number"
              placeholder="Max"
              value={filters.maxAmount ?? ""}
              onChange={handleMaxAmountChange}
            />
          </div>
        </div>
      </div>

      {/* Özel Tarih Seçilirse */}
      {filters.dateRange === "custom" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/40 max-w-md">
          <Input
            label="Başlangıç Tarihi"
            type="date"
            value={filters.customMinDate ?? ""}
            onChange={handleCustomMinDateChange}
          />
          <Input
            label="Bitiş Tarihi"
            type="date"
            value={filters.customMaxDate ?? ""}
            onChange={handleCustomMaxDateChange}
          />
        </div>
      )}
    </div>
  );
};

export default TransactionFiltersPanel;
