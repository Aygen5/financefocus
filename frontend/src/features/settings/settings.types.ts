import { z } from "zod";

export const profileFormSchema = z.object({
  fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girilmelidir"),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Eski şifre en az 6 karakter olmalıdır"),
    newPassword: z.string().min(6, "Yeni şifre en az 6 karakter olmalıdır"),
    confirmPassword: z.string().min(6, "Yeni şifre onayı en az 6 karakter olmalıdır"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Yeni şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
