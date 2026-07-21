import { z } from "zod";

export const subscriptionFormSchema = z.object({
  name: z.string().min(2, "Hizmet adı en az 2 karakter olmalıdır"),
  price: z
    .number({ invalid_type_error: "Tutar bir sayı olmalıdır" })
    .positive("Tutar pozitif bir sayı olmalıdır"),
  cycle: z.string().min(1, "Ödeme döngüsü seçilmelidir"),
  category: z.string().min(1, "Kategori seçilmelidir"),
  nextPayment: z.string().min(1, "Bir sonraki ödeme tarihi zorunludur"),
  billingType: z.string().min(1, "Fatura ödeme türü seçilmelidir"),
});

export type SubscriptionFormData = z.infer<typeof subscriptionFormSchema>;
