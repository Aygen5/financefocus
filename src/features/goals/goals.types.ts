import { z } from "zod";

export const goalFormSchema = z
  .object({
    name: z.string().min(3, "Hedef adı en az 3 karakter olmalıdır"),
    targetAmount: z
      .number({ invalid_type_error: "Hedef tutarı bir sayı olmalıdır" })
      .positive("Hedef tutarı pozitif olmalıdır"),
    currentAmount: z
      .number({ invalid_type_error: "Başlangıç tutarı bir sayı olmalıdır" })
      .nonnegative("Başlangıç tutarı sıfır veya daha büyük olmalıdır"),
    deadline: z.string().min(1, "Hedef tarihi zorunludur"),
    monthlyContribution: z
      .number({ invalid_type_error: "Aylık katkı bir sayı olmalıdır" })
      .nonnegative("Aylık katkı sıfır veya daha büyük olmalıdır"),
  })
  .refine((data) => data.currentAmount <= data.targetAmount, {
    message: "Başlangıç tutarı hedef tutarından büyük olamaz",
    path: ["currentAmount"],
  });

export type GoalFormData = z.infer<typeof goalFormSchema>;
