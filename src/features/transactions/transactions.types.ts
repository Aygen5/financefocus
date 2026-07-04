import { z } from "zod";

export const transactionFormSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Tutar bir sayı olmalıdır" })
    .positive("Tutar pozitif olmalıdır"),
  type: z.enum(["income", "expense"], {
    required_error: "İşlem türü seçilmelidir",
  }),
  category: z.string().min(1, "Kategori seçilmelidir"),
  account: z.string().min(1, "Hesap seçilmelidir"),
  description: z.string().min(3, "Açıklama en az 3 karakter olmalıdır"),
  date: z.string().min(1, "Tarih zorunludur"),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;
