import { z } from "zod";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  transactionType: "income" | "expense" | "neutral";
  category: string;
  paymentMethod?: string;
  date: string;
  status?: "completed" | "pending" | "failed";
  description: string;
  account: string;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionFilters {
  search: string;
  transactionType: "income" | "expense" | "neutral" | "all";
  category: string;
  dateRange: "today" | "last7days" | "thismonth" | "last3months" | "thisyear" | "custom" | "all";
  customMinDate?: string;
  customMaxDate?: string;
  minAmount?: number;
  maxAmount?: number;
  status: "completed" | "pending" | "failed" | "all";
}

export const transactionFormSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Tutar sayısal bir değer olmalıdır." })
    .positive("Tutar sıfırdan büyük olmalıdır."),
  transactionType: z.enum(["income", "expense", "neutral"], {
    errorMap: () => ({ message: "Geçersiz işlem türü." }),
  }),
  category: z.string().min(2, "Kategori adı en az 2 karakter olmalıdır."),
  description: z.string().min(3, "Açıklama en az 3 karakter olmalıdır."),
  account: z.string().min(2, "Hesap adı en az 2 karakter olmalıdır."),
  date: z.string().min(10, "Lütfen geçerli bir tarih seçiniz."),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;
