import { z } from "zod";

export const budgetFormSchema = z.object({
  category: z.string().min(1, "Kategori seçilmelidir"),
  limit: z
    .number({ invalid_type_error: "Limit tutarı bir sayı olmalıdır" })
    .positive("Limit tutarı pozitif olmalıdır"),
  description: z.string().optional(),
});

export type BudgetFormData = z.infer<typeof budgetFormSchema>;
