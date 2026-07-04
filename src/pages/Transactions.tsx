import React, { useEffect, useState, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTransactions, addTransaction } from "@/features/transactions/transactionsSlice";
import { transactionFormSchema } from "@/features/transactions/transactions.types";
import type { TransactionFormData } from "@/features/transactions/transactions.types";
import DataTable from "@/components/display/DataTable";
import type { Column } from "@/components/display/DataTable";
import Badge from "@/components/display/Badge";
import CurrencyDisplay from "@/components/display/CurrencyDisplay";
import Pagination from "@/components/display/Pagination";
import Modal from "@/components/overlay/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Search, Download, Calendar, Plus, MoreVertical } from "lucide-react";
import toast from "react-hot-toast";
import type { Transaction } from "@/features/transactions/transactionsSlice";

const Transactions: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchInputId = useId();
  const { items: transactions, loading } = useAppSelector((state) => state.transactions);

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 8;

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: undefined,
      type: "expense",
      category: "",
      account: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Filtreleme mantığı
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter
      ? t.category.toLowerCase() === categoryFilter.toLowerCase()
      : true;

    let matchesAmount = true;
    if (amountFilter === "high") {
      matchesAmount = t.amount > 10000;
    } else if (amountFilter === "med") {
      matchesAmount = t.amount >= 1000 && t.amount <= 10000;
    } else if (amountFilter === "low") {
      matchesAmount = t.amount < 1000;
    }

    return matchesSearch && matchesCategory && matchesAmount;
  });

  // Sayfalama mantığı
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleExportCSV = () => {
    toast.success("CSV verileri dışa aktarılıyor.");
  };

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      const resultAction = await dispatch(addTransaction(data));
      if (addTransaction.fulfilled.match(resultAction)) {
        toast.success("İşlem başarıyla eklendi");
        reset();
        setIsModalOpen(false);
      }
    } catch {
      toast.error("İşlem eklenirken hata oluştu");
    }
  };

  // DataTable columns definitions
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
            case "infrastructure":
            case "altyapı":
              return "brand";
            case "revenue":
            case "gelir":
            case "maaş":
              return "success";
            case "facilities":
            case "kira":
              return "warning";
            case "software":
            case "yazılım":
              return "brand";
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
      render: (row) => <span className="text-on-surface-variant">{row.account || "Default"}</span>,
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
    {
      key: "actions",
      header: "",
      className: "text-right w-16",
      render: () => (
        <button className="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer">
          <MoreVertical size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Transactions</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage and track all enterprise financial movements.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" icon={<Download size={18} />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-6 shadow-soft-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-slate-400">
              <Search size={18} />
            </span>
            <label htmlFor={searchInputId} className="sr-only">
              Açıklama Ara
            </label>
            <input
              id={searchInputId}
              type="text"
              placeholder="Search description..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Category Select */}
          <Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: "", label: "All Categories" },
              { value: "infrastructure", label: "Infrastructure" },
              { value: "revenue", label: "Revenue" },
              { value: "facilities", label: "Facilities" },
              { value: "software", label: "Software" },
              { value: "services", label: "Professional Services" },
            ]}
          />

          {/* Date Picker (Statik) */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-slate-400">
              <Calendar size={18} />
            </span>
            <input
              type="text"
              readOnly
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none cursor-pointer"
              placeholder="Oct 1 - Oct 31, 2023"
            />
          </div>

          {/* Amount Filter */}
          <Select
            value={amountFilter}
            onChange={(e) => {
              setAmountFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: "", label: "Any Amount" },
              { value: "high", label: "> $10,000" },
              { value: "med", label: "$1,000 - $10,000" },
              { value: "low", label: "< $1,000" },
            ]}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-soft-sm overflow-hidden flex flex-col h-[520px]">
        <div className="flex-1 overflow-auto">
          <DataTable
            columns={columns}
            data={paginatedTransactions}
            loading={loading}
            emptyTitle="İşlem kaydı bulunamadı"
            emptyDescription="Seçilen filtre kriterlerine uygun işlem listelenemiyor."
          />
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="border-t border-outline-variant bg-surface px-6 py-4 flex items-center justify-between">
            <div className="font-body-sm text-body-sm text-on-surface-variant">
              Gösterilen:{" "}
              <span className="font-semibold text-on-surface">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              -{" "}
              <span className="font-semibold text-on-surface">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              / <span className="font-semibold text-on-surface">{totalItems}</span> işlem
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modal - Yeni İşlem Ekleme */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Tutar"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register("amount", { valueAsNumber: true })}
          />

          <Select
            label="İşlem Türü"
            error={errors.type?.message}
            options={[
              { value: "expense", label: "Gider (Expense)" },
              { value: "income", label: "Gelir (Income)" },
            ]}
            {...register("type")}
          />

          <Input
            label="Kategori"
            placeholder="Kategori adı girin (örn. Yazılım, Maaş)"
            error={errors.category?.message}
            {...register("category")}
          />

          <Input
            label="Hesap / Ödeme Kaynağı"
            placeholder="Ödeme kaynağı (örn. Corporate Card)"
            error={errors.account?.message}
            {...register("account")}
          />

          <Input
            label="Açıklama"
            placeholder="İşlem açıklaması"
            error={errors.description?.message}
            {...register("description")}
          />

          <Input label="Tarih" type="date" error={errors.date?.message} {...register("date")} />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              İptal
            </Button>
            <Button variant="primary" type="submit" loading={isSubmitting}>
              Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
