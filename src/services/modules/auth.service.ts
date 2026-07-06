import api from "../api";
import ENDPOINTS from "../api/endpoints";
import type { LoginFormData, RegisterFormData } from "@/features/auth/auth.types";
import type { User } from "@/features/auth/authSlice";

export const AuthService = {
  login: async (credentials: LoginFormData): Promise<User> => {
    // TODO: [Backend Entegrasyonu] Gerçek API'ye geçerken credentials post edilmeli ve token kaydedilmelidir:
    // const response = await api.post<{ user: User; token: string }>(ENDPOINTS.AUTH.LOGIN, credentials);
    // localStorage.setItem("token", response.data.token);
    // return response.data.user;
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
    // TODO: [Backend Entegrasyonu] Gerçek API'ye geçerken register POST formatı ve dönüş tipi apiye göre güncellenmelidir:
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
