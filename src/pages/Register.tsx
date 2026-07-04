import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store";
import { registerUser, clearError } from "@/features/auth/authSlice";
import { registerSchema } from "@/features/auth/auth.types";
import type { RegisterFormData } from "@/features/auth/auth.types";
import { User as UserIcon, Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Hata durumunu toast ile göster
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const resultAction = await dispatch(
        registerUser({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        }),
      );

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success("Kayıt işleminiz başarıyla tamamlandı. Giriş yapabilirsiniz.");
        navigate("/login");
      }
    } catch {
      toast.error("Kayıt sırasında bir hata oluştu");
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex items-center justify-center p-gutter">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),_0_4px_6px_-2px_rgba(0,0,0,0.03)] p-8">
        {/* Logo Header */}
        <div className="text-center mb-stack-lg">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-stack-sm tracking-tight">
            FinanceFocus
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Hesap oluşturun</p>
        </div>

        {/* Kayıt Formu */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-stack-md text-left">
          {/* Ad Soyad */}
          <div className="flex flex-col gap-base">
            <label className="font-label-sm text-label-sm text-on-surface" htmlFor="fullName">
              Ad Soyad
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-slate-450">
                <UserIcon size={18} />
              </span>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-2 bg-surface-container-lowest border rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-3 transition-all placeholder:text-outline-variant ${
                  errors.fullName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-outline-variant focus:border-primary focus:ring-primary/20"
                }`}
                {...register("fullName")}
              />
            </div>
            {errors.fullName && (
              <span className="text-[12px] font-medium text-red-500 mt-0.5">
                {errors.fullName.message}
              </span>
            )}
          </div>

          {/* E-posta */}
          <div className="flex flex-col gap-base">
            <label className="font-label-sm text-label-sm text-on-surface" htmlFor="email">
              E-posta Adresi
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-slate-450">
                <Mail size={18} />
              </span>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                className={`w-full pl-10 pr-4 py-2 bg-surface-container-lowest border rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-3 transition-all placeholder:text-outline-variant ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-outline-variant focus:border-primary focus:ring-primary/20"
                }`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-[12px] font-medium text-red-500 mt-0.5">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Şifre */}
          <div className="flex flex-col gap-base">
            <label className="font-label-sm text-label-sm text-on-surface" htmlFor="password">
              Şifre
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-slate-450">
                <Lock size={18} />
              </span>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2 bg-surface-container-lowest border rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-3 transition-all placeholder:text-outline-variant ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-outline-variant focus:border-primary focus:ring-primary/20"
                }`}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <span className="text-[12px] font-medium text-red-500 mt-0.5">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Şifre Tekrarı */}
          <div className="flex flex-col gap-base">
            <label
              className="font-label-sm text-label-sm text-on-surface"
              htmlFor="confirmPassword"
            >
              Şifre Tekrarı
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-slate-450">
                <Lock size={18} />
              </span>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2 bg-surface-container-lowest border rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-3 transition-all placeholder:text-outline-variant ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-outline-variant focus:border-primary focus:ring-primary/20"
                }`}
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-[12px] font-medium text-red-500 mt-0.5">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Koşullar */}
          <div className="flex items-start gap-2 mt-stack-sm">
            <input
              id="terms"
              type="checkbox"
              className="mt-1 w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary focus:ring-2 cursor-pointer"
              {...register("terms")}
            />
            <label
              className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none leading-relaxed"
              htmlFor="terms"
            >
              Kullanım{" "}
              <a className="text-primary hover:underline" href="#">
                Koşullarını
              </a>{" "}
              ve{" "}
              <a className="text-primary hover:underline" href="#">
                Gizlilik Politikasını
              </a>{" "}
              kabul ediyorum.
            </label>
          </div>
          {errors.terms && (
            <span className="text-[12px] font-medium text-red-500 block">
              {errors.terms.message}
            </span>
          )}

          {/* Submit Butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-stack-sm py-2.5 px-4 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50 transition-colors duration-200 focus:outline-none flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Kayıt Ol"}
          </button>
        </form>

        {/* Giriş Linki */}
        <div className="mt-stack-lg text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Zaten bir hesabınız var mı?{" "}
            <Link
              to="/login"
              className="font-label-md text-label-md text-primary hover:underline transition-all"
            >
              Giriş Yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
