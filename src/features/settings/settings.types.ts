import { z } from "zod";

export const profileFormSchema = z.object({
  fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girilmelidir"),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
