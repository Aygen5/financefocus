import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store";
import { loginUser, clearError } from "@/features/auth/authSlice";
import { loginSchema } from "@/features/auth/auth.types";
import type { LoginFormData } from "@/features/auth/auth.types";
import { addActivityLog } from "@/features/activity/activitySlice";
import { addNotification } from "@/features/notifications/notificationsSlice";
import { Mail, Lock, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import z from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "E-posta adresi zorunludur").email("Geçersiz e-posta adresi"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isForgotSuccess, setIsForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

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

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
    reset: resetForgot,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(
        addActivityLog({
          action: "Giriş Yap",
          category: "Auth",
          description: "Kullanıcı sisteme başarıyla giriş yaptı.",
          user: "Aygen",
          icon: "LogIn",
          status: "success",
        }),
      );
      dispatch(
        addNotification({
          title: "Giriş Başarılı",
          message: "FinanceFocus hesabınıza başarıyla giriş yaptınız.",
          type: "success",
          icon: "LogIn",
        }),
      );
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    dispatch(loginUser(data));
  };

  const onForgotSubmit = async (data: ForgotPasswordFormData) => {
    setForgotLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setForgotLoading(false);
    setIsForgotSuccess(true);
    toast.success(`Şifre sıfırlama bağlantısı ${data.email} adresine gönderildi!`);
  };

  const handleQuickDemoFill = () => {
    setValue("email", "demo@financefocus.com");
    setValue("password", "123456");
    toast.success("Demo giriş bilgileri dolduruldu!");
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="text-left space-y-2">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
          {isForgotPassword ? "Şifremi Unuttum" : "Giriş Yap"}
        </h1>
        <p className="text-xs font-semibold text-slate-550 dark:text-slate-400">
          {isForgotPassword
            ? "Hesabınızın e-posta adresini girerek şifre sıfırlama talebinde bulunun."
            : "Tekrar hoş geldiniz. Lütfen bilgilerinizi girin."}
        </p>
      </div>

      {isForgotPassword ? (
        <div className="space-y-6">
          {isForgotSuccess ? (
            <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-left space-y-4">
              <div className="flex items-center gap-3 text-emerald-500">
                <CheckCircle2 size={24} className="shrink-0" />
                <h4 className="font-bold text-sm">Sıfırlama Bağlantısı Gönderildi!</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                E-posta adresinize şifre sıfırlama yönergelerini içeren bir bağlantı gönderdik.
                Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.
              </p>
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setIsForgotSuccess(false);
                  resetForgot();
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={14} />
                Giriş Sayfasına Dön
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitForgot(onForgotSubmit)} className="space-y-5 text-left">
              <div>
                <label
                  className="block font-label-sm text-label-sm text-slate-700 dark:text-slate-350 mb-1.5"
                  htmlFor="forgot-email"
                >
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="name@company.com"
                    className={`block w-full pl-10 pr-3 py-2 border rounded-xl font-body-md text-body-md text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 transition-all ${
                      errorsForgot.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-250 dark:border-slate-800 focus:border-primary focus:ring-primary/20"
                    }`}
                    {...registerForgot("email")}
                  />
                </div>
                {errorsForgot.email && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 block">
                    {errorsForgot.email.message}
                  </span>
                )}
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm font-label-md text-label-md text-white bg-primary hover:bg-primary-container disabled:opacity-50 transition-colors items-center gap-2 cursor-pointer"
                >
                  {forgotLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Bağlantı Gönder"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    resetForgot();
                  }}
                  className="w-full py-2.5 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Giriş Sayfasına Dön
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          {/* E-posta Alanı */}
          <div>
            <label
              className="block font-label-sm text-label-sm text-slate-700 dark:text-slate-350 mb-1.5"
              htmlFor="email"
            >
              E-posta Adresi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                className={`block w-full pl-10 pr-3 py-2 border rounded-xl font-body-md text-body-md text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-250 dark:border-slate-800 focus:border-primary focus:ring-primary/20"
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-[11px] font-bold text-red-500 mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                className="block font-label-sm text-label-sm text-slate-700 dark:text-slate-350"
                htmlFor="password"
              >
                Şifre
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setIsForgotSuccess(false);
                }}
                className="font-label-sm text-label-sm text-primary hover:underline transition-all cursor-pointer"
              >
                Şifrenizi mi unuttunuz?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`block w-full pl-10 pr-3 py-2 border rounded-xl font-body-md text-body-md text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-250 dark:border-slate-800 focus:border-primary focus:ring-primary/20"
                }`}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <span className="text-[11px] font-bold text-red-500 mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
              {...register("rememberMe")}
            />
            <label
              className="ml-2 block font-body-sm text-body-sm text-slate-500 dark:text-slate-400 cursor-pointer select-none"
              htmlFor="remember-me"
            >
              30 gün boyunca beni hatırla
            </label>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm font-label-md text-label-md text-white bg-primary hover:bg-primary-container disabled:opacity-50 transition-colors items-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Giriş Yap"}
            </button>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="w-full py-2 px-4 border border-dashed border-brand-300 dark:border-brand-500/50 rounded-xl font-label-sm text-label-sm text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Hızlı Demo Bilgileriyle Doldur
            </button>
          </div>
        </form>
      )}

      <div className="pt-4 text-center">
        <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400">
          Hesabınız yok mu?{" "}
          <Link
            to="/register"
            className="font-label-md text-label-md text-primary hover:underline transition-all"
          >
            Hesap Oluşturun
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
