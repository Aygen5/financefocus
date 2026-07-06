import api from "../api";
import ENDPOINTS from "../api/endpoints";
import type { LoginFormData, RegisterFormData } from "@/features/auth/auth.types";
import type { User } from "@/features/auth/authSlice";

export const AuthService = {
  login: async (credentials: LoginFormData): Promise<User> => {
    const response = await api.get<User[]>(ENDPOINTS.AUTH.LOGIN);
    const user = response.data.find((u) => u.email === credentials.email);
    if (!user) {
      throw new Error("Kullanıcı adı veya şifre hatalı.");
    }
    return user;
  },

  register: async (
    userData: Omit<RegisterFormData, "confirmPassword" | "terms">,
  ): Promise<User> => {
    const response = await api.post<User>(ENDPOINTS.AUTH.REGISTER, {
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Mock veya gerçek backend çıkışı
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default AuthService;
