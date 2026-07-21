import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionFormSchema } from "../types/transactions.types";
import type { TransactionFormData } from "../types/transactions.types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  defaultValues?: Partial<TransactionFormData>;
  submitLabel?: string;
  loading?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  defaultValues,
  submitLabel = "Kaydet",
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: undefined,
      transactionType: "expense",
      category: "",
      description: "",
      account: "",
      date: new Date().toISOString().split("T")[0],
      ...defaultValues,
    },
  });

  // Edit durumunda defaultValues değişirse formu sıfırla
  useEffect(() => {
    if (defaultValues) {
      reset({
        amount: defaultValues.amount,
        transactionType: defaultValues.transactionType || "expense",
        category: defaultValues.category || "",
        description: defaultValues.description || "",
        account: defaultValues.account || "",
        date: defaultValues.date || new Date().toISOString().split("T")[0],
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
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
        error={errors.transactionType?.message}
        options={[
          { value: "expense", label: "Gider (Expense)" },
          { value: "income", label: "Gelir (Income)" },
          { value: "neutral", label: "Nötr (Transfer/Diğer)" },
        ]}
        {...register("transactionType")}
      />

      <Input
        label="Kategori"
        placeholder="Örn: Market, Kira, Maaş, Faturalar"
        error={errors.category?.message}
        {...register("category")}
      />

      <Input
        label="Hesap / Kaynak"
        placeholder="Örn: Garanti Kredi Kartı, Enpara Vadesiz"
        error={errors.account?.message}
        {...register("account")}
      />

      <Input
        label="Açıklama"
        placeholder="Örn: Migros Sanal Market Alışverişi"
        error={errors.description?.message}
        {...register("description")}
      />

      <Input label="Tarih" type="date" error={errors.date?.message} {...register("date")} />

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <Button variant="primary" type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
