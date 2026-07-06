import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store";
import { loginUser, clearError } from "@/features/auth/authSlice";
import { loginSchema } from "@/features/auth/auth.types";
import type { LoginFormData } from "@/features/auth/auth.types";
import { addActivityLog } from "@/features/activity/activitySlice";
import { addNotification } from "@/features/notifications/notificationsSlice";
import { Mail, Lock, Landmark, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Giriş durumunu izle ve yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(
        addActivityLog({
          action: "Login",
          category: "Auth",
          description: "Kullanıcı sisteme başarıyla giriş yaptı.",
          user: "Aygen",
          icon: "LogIn",
          status: "success",
        }),
      );
      dispatch(
        addNotification({
          title: "Login başarılı",
          message: "FinanceFocus hesabınıza başarıyla giriş yaptınız.",
          type: "success",
          icon: "LogIn",
        }),
      );
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, dispatch]);

  // Hata durumunu toast ile göster
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    dispatch(loginUser(data));
  };

  // Demo bilgileri ile hızlı doldurma fonksiyonu
  const handleQuickDemoFill = () => {
    setValue("email", "demo@financefocus.com");
    setValue("password", "123456");
    toast.success("Demo giriş bilgileri dolduruldu!");
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4 antialiased text-on-background">
      <main className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.03)] border border-outline-variant p-8 md:p-10">
        {/* Logo ve Başlık */}
        <div className="flex flex-col items-center mb-stack-lg text-center">
          <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center mb-stack-md text-white">
            <Landmark size={24} />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">FinanceFocus</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Tekrar hoş geldiniz. Lütfen hesabınıza giriş yapın.
          </p>
        </div>

        {/* Giriş Formu */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-stack-md text-left">
          {/* E-posta Alanı */}
          <div>
            <label
              className="block font-label-sm text-label-sm text-on-surface mb-stack-sm"
              htmlFor="email"
            >
              E-posta Adresi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-3 transition-all ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-outline-variant focus:border-primary focus:ring-primary/20"
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-[12px] font-medium text-red-500 mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Şifre Alanı */}
          <div>
            <div className="flex items-center justify-between mb-stack-sm">
              <label
                className="block font-label-sm text-label-sm text-on-surface"
                htmlFor="password"
              >
                Şifre
              </label>
              <a
                href="#"
                className="font-label-sm text-label-sm text-primary hover:text-on-primary-fixed-variant transition-colors"
              >
                Şifrenizi mi unuttunuz?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg font-body-md text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-3 transition-all ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-outline-variant focus:border-primary focus:ring-primary/20"
                }`}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <span className="text-[12px] font-medium text-red-500 mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Beni Hatırla */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer"
              {...register("rememberMe")}
            />
            <label
              className="ml-2 block font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none"
              htmlFor="remember-me"
            >
              30 gün boyunca beni hatırla
            </label>
          </div>

          {/* Giriş Butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50 transition-colors mt-stack-lg items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Giriş Yap"}
          </button>
        </form>

        {/* Hızlı Demo Doldurma Butonu */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="w-full py-2 px-4 border border-dashed border-brand-300 rounded-lg font-label-sm text-label-sm text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer dark:hover:bg-slate-800"
          >
            Hızlı Demo Bilgileriyle Doldur
          </button>
        </div>

        {/* Kayıt Ol Linki */}
        <div className="mt-stack-lg text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Hesabınız yok mu?{" "}
            <Link
              to="/register"
              className="font-label-md text-label-md text-primary hover:underline transition-all"
            >
              Hesap Oluşturun
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
