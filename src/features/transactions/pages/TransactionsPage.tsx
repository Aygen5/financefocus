import React, { useState, useId } from "react";
import useTransactions from "../hooks/useTransactions";
import DataTable from "@/components/data-display/DataTable";
import type { Column } from "@/components/data-display/DataTable";
import CurrencyDisplay from "@/components/data-display/CurrencyDisplay";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import EmptyState from "@/components/feedback/EmptyState";
import ErrorState from "@/components/feedback/ErrorState";
import TransactionForm from "../components/TransactionForm";
import TransactionFiltersPanel from "../components/TransactionFiltersPanel";
import { SkeletonTable } from "@/components/ui/Skeleton";
import type { Transaction, TransactionFormData } from "../types/transactions.types";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  FolderOpen,
  RotateCcw,
  AlertTriangle,
  AlertCircle,
  WifiOff,
} from "lucide-react";

export const TransactionsPage: React.FC = () => {
  const searchInputId = useId();
  const {
    transactions,
    allTransactions,
    filters,
    activeFiltersCount,
    loading,
    error,
    handleRetry,
    handleSetFilters,
    handleSetSearch,
    handleResetFilters,
    handleAddTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
  } = useTransactions();

  // Modal ve Dialog States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleOpenEdit = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setIsDeleteOpen(true);
  };

  const onAddSubmit = async (data: TransactionFormData) => {
    setIsSubmitLoading(true);
    const success = await handleAddTransaction({
      ...data,
      currency: "TRY",
    });
    setIsSubmitLoading(false);
    if (success) {
      setIsAddModalOpen(false);
    }
  };

  const onEditSubmit = async (data: TransactionFormData) => {
    if (!selectedTransaction) return;
    setIsSubmitLoading(true);
    const success = await handleUpdateTransaction(selectedTransaction.id, {
      ...data,
      currency: "TRY",
    });
    setIsSubmitLoading(false);
    if (success) {
      setIsEditModalOpen(false);
      setSelectedTransaction(null);
    }
  };

  const onDeleteConfirm = async () => {
    if (!selectedTransaction) return;
    setIsSubmitLoading(true);
    const success = await handleDeleteTransaction(selectedTransaction.id);
    setIsSubmitLoading(false);
    if (success) {
      setIsDeleteOpen(false);
      setSelectedTransaction(null);
    }
  };

  // Dinamik Hata Mesajı ve İkon Belirleme Mantığı
  const getErrorConfig = (errStr: string) => {
    const lowerErr = errStr.toLowerCase();
    if (
      lowerErr.includes("network") ||
      lowerErr.includes("conn") ||
      lowerErr.includes("bağlantı")
    ) {
      return {
        title: "API Bağlantı Hatası",
        description:
          "Sunucu bağlantısı kurulamadı. Lütfen internet bağlantınızı kontrol edip tekrar deneyiniz.",
        icon: <WifiOff size={24} />,
      };
    }
    if (lowerErr.includes("timeout") || lowerErr.includes("zaman aşımı")) {
      return {
        title: "İstek Zaman Aşımına Uğradı",
        description:
          "Sunucu yanıt verme süresi aşıldı. Lütfen internet hızınızı kontrol edip tekrar deneyiniz.",
        icon: <AlertCircle size={24} />,
      };
    }
    if (lowerErr.includes("500") || lowerErr.includes("server") || lowerErr.includes("sunucu")) {
      return {
        title: "Beklenmeyen Sunucu Hatası",
        description:
          "Sunucumuzda teknik bir aksaklık meydana geldi. Mühendislerimiz konuyla ilgileniyor.",
        icon: <AlertTriangle size={24} />,
      };
    }
    return {
      title: "Bir Hata Oluştu",
      description:
        errStr || "Veriler yüklenirken bilinmeyen bir problem yaşandı. Lütfen tekrar deneyiniz.",
      icon: <AlertCircle size={24} />,
    };
  };

  // Column definitions for the DataTable
  const columns: Column<Transaction>[] = [
    {
      key: "date",
      header: "Tarih",
      render: (row) => {
        try {
          const parsedDate = parseISO(row.date);
          return format(parsedDate, "dd MMMM yyyy", { locale: tr });
        } catch {
          return row.date;
        }
      },
    },
    {
      key: "description",
      header: "Açıklama",
      render: (row) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">{row.description}</span>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      render: (row) => {
        const getCategoryVariant = (cat: string) => {
          switch (cat.toLowerCase()) {
            case "salary":
            case "income":
              return "success";
            case "rent":
            case "bills":
              return "warning";
            case "investment":
              return "brand";
            case "subscription":
              return "primary";
            default:
              return "neutral";
          }
        };
        return <Badge variant={getCategoryVariant(row.category)}>{row.category}</Badge>;
      },
    },
    {
      key: "account",
      header: "Hesap",
      render: (row) => (
        <span className="text-slate-500 dark:text-slate-400 font-semibold">
          {row.account || "Default"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Tutar",
      className: "text-right",
      render: (row) => (
        <CurrencyDisplay
          amount={row.amount}
          currency={row.currency || "TRY"}
          type={row.transactionType || (row.amount > 0 ? "income" : "expense")}
          colored
        />
      ),
    },
    {
      key: "actions",
      header: "Aksiyonlar",
      className: "text-right w-28 select-none",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 hover:text-primary dark:hover:text-brand-400 transition-colors cursor-pointer"
            title="Düzenle"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => handleOpenDelete(row)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
            title="Sil"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-stack-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Transactions
          </h2>
          <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400 font-medium mt-1">
            Tüm finansal hareketlerinizin ve işlemlerinizin detaylı listesi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none select-none">
              <Search size={16} />
            </span>
            <label htmlFor={searchInputId} className="sr-only">
              İşlemlerde arayın
            </label>
            <input
              id={searchInputId}
              type="text"
              placeholder="İşlemlerde arayın..."
              value={filters.search}
              onChange={(e) => handleSetSearch(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 font-semibold text-xs text-slate-700 dark:text-slate-205 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder-slate-400"
            />
          </div>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      <TransactionFiltersPanel
        filters={filters}
        activeFiltersCount={activeFiltersCount}
        onFilterChange={handleSetFilters}
        onReset={handleResetFilters}
      />

      {/* Data Table / Loading / Empty / Error States Container */}
      {loading ? (
        <SkeletonTable columns={6} rows={8} />
      ) : error ? (
        // Hata Durumu (Error State)
        (() => {
          const config = getErrorConfig(error);
          return (
            <ErrorState
              title={config.title}
              description={config.description}
              icon={config.icon}
              onRetry={handleRetry}
              retryLabel="Tekrar Dene"
              retryIcon={<RotateCcw size={16} />}
            />
          );
        })()
      ) : transactions.length === 0 ? (
        allTransactions.length === 0 ? (
          // Senaryo 1: Sistemde hiç işlem yok
          <EmptyState
            title="Henüz İşlem Kaydedilmedi"
            description="Gelir veya gider hareketlerinizi ekleyerek bütçenizi yönetmeye başlayabilirsiniz."
            icon={<FolderOpen size={24} />}
            primaryActionLabel="Yeni İşlem Ekle"
            onPrimaryActionClick={() => setIsAddModalOpen(true)}
            primaryActionIcon={<Plus size={16} />}
          />
        ) : filters.search.trim() !== "" ? (
          // Senaryo 2: Arama sonucu bulunamadı
          <EmptyState
            title="Arama Sonucu Bulunamadı"
            description={`"${filters.search}" araması ile eşleşen herhangi bir işlem kaydı mevcut değil.`}
            icon={<Search size={24} />}
            primaryActionLabel="Aramayı Temizle"
            onPrimaryActionClick={() => handleSetSearch("")}
            primaryActionIcon={<RotateCcw size={16} />}
          />
        ) : (
          // Senaryo 3: Filtre sonucu bulunamadı
          <EmptyState
            title="Filtre Sonucu Bulunamadı"
            description="Seçilen filtrelere uygun herhangi bir işlem bulunamadı. Filtreleri temizleyerek tekrar deneyebilirsiniz."
            icon={<AlertTriangle size={24} />}
            primaryActionLabel="Filtreleri Temizle"
            onPrimaryActionClick={handleResetFilters}
            primaryActionIcon={<RotateCcw size={16} />}
          />
        )
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-soft-sm">
          <DataTable columns={columns} data={transactions} />
        </div>
      )}

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yeni İşlem Ekle"
        size="md"
      >
        <TransactionForm onSubmit={onAddSubmit} loading={isSubmitLoading} submitLabel="Ekle" />
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTransaction(null);
        }}
        title="İşlemi Düzenle"
        size="md"
      >
        {selectedTransaction && (
          <TransactionForm
            onSubmit={onEditSubmit}
            loading={isSubmitLoading}
            defaultValues={{
              amount: selectedTransaction.amount,
              transactionType: selectedTransaction.transactionType,
              category: selectedTransaction.category,
              description: selectedTransaction.description,
              account: selectedTransaction.account,
              date: selectedTransaction.date,
            }}
            submitLabel="Güncelle"
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedTransaction(null);
        }}
        onConfirm={onDeleteConfirm}
        loading={isSubmitLoading}
        title="İşlemi Silmek İstediğinize Emin misiniz?"
        description="Bu işlem seçilen finansal hareketi kalıcı olarak silecektir ve işlem geri alınamaz."
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
        variant="danger"
      />
    </div>
  );
};

export default TransactionsPage;
