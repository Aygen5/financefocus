import { z } from "zod";

/**
 * Giriş (Login) Formu Validasyon Şeması
 */
export const loginSchema = z.object({
  email: z.string().min(1, "E-posta adresi zorunludur").email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Kayıt (Register) Formu Validasyon Şeması
 */
export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır").trim(),
    email: z
      .string()
      .min(1, "E-posta adresi zorunludur")
      .email("Geçerli bir e-posta adresi giriniz"),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .regex(/[a-zA-Z]/, "Şifre en az bir harf içermelidir")
      .regex(/[0-9]/, "Şifre en az bir rakam içermelidir"),
    confirmPassword: z.string().min(1, "Şifre tekrarı zorunludur"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "Koşulları kabul etmeniz gerekmektedir" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
