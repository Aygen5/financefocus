import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store";
import { registerUser, clearError } from "@/features/auth/authSlice";
import { registerSchema } from "@/features/auth/auth.types";
import type { RegisterFormData } from "@/features/auth/auth.types";
import { addActivityLog } from "@/features/activity/activitySlice";
import { addNotification } from "@/features/notifications/notificationsSlice";
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
        dispatch(
          addActivityLog({
            action: "Kayıt Ol",
            category: "Auth",
            description: "Yeni kullanıcı hesabı başarıyla oluşturuldu.",
            user: data.fullName,
            icon: "UserPlus",
            status: "success",
          }),
        );
        dispatch(
          addNotification({
            title: "Kayıt Başarılı",
            message: "FinanceFocus hesabınız başarıyla oluşturuldu. Giriş yapabilirsiniz.",
            type: "success",
            icon: "UserPlus",
          }),
        );
        toast.success("Kayıt işleminiz başarıyla tamamlandı. Giriş yapabilirsiniz.");
        navigate("/login");
      }
    } catch {
      toast.error("Kayıt sırasında bir hata oluştu");
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo Header */}
      <div className="text-left space-y-2 select-none">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
          Hesap Oluşturun
        </h1>
        <p className="text-xs font-semibold text-slate-555 dark:text-slate-400">
          Kişisel finansal geleceğinizi inşa etmek için kayıt olun.
        </p>
      </div>

      {/* Kayıt Formu */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {/* Ad Soyad */}
        <div>
          <label
            className="block font-label-sm text-label-sm text-slate-700 dark:text-slate-350 mb-1.5"
            htmlFor="fullName"
          >
            Ad Soyad
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none">
              <UserIcon size={16} />
            </span>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              className={`block w-full pl-10 pr-3 py-2 border rounded-xl font-body-md text-body-md text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-250 dark:border-slate-800 focus:border-primary focus:ring-primary/20"
              }`}
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <span className="text-[11px] font-bold text-red-500 mt-1 block">
              {errors.fullName.message}
            </span>
          )}
        </div>

        {/* E-posta */}
        <div>
          <label
            className="block font-label-sm text-label-sm text-slate-700 dark:text-slate-350 mb-1.5"
            htmlFor="email"
          >
            E-posta Adresi
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none">
              <Mail size={16} />
            </span>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
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

        {/* Şifre */}
        <div>
          <label
            className="block font-label-sm text-label-sm text-slate-700 dark:text-slate-350 mb-1.5"
            htmlFor="password"
          >
            Şifre
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none">
              <Lock size={16} />
            </span>
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

        {/* Şifre Tekrarı */}
        <div>
          <label
            className="block font-label-sm text-label-sm text-slate-700 dark:text-slate-350 mb-1.5"
            htmlFor="confirmPassword"
          >
            Şifre Tekrarı
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none">
              <Lock size={16} />
            </span>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className={`block w-full pl-10 pr-3 py-2 border rounded-xl font-body-md text-body-md text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-250 dark:border-slate-800 focus:border-primary focus:ring-primary/20"
              }`}
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-[11px] font-bold text-red-500 mt-1 block">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Koşullar */}
        <div className="flex items-start gap-2 pt-1">
          <input
            id="terms"
            type="checkbox"
            className="mt-0.5 w-4 h-4 text-primary bg-white dark:bg-slate-900 border-slate-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
            {...register("terms")}
          />
          <label
            className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400 cursor-pointer select-none leading-relaxed"
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
          <span className="text-[11px] font-bold text-red-500 mt-1 block">
            {errors.terms.message}
          </span>
        )}

        {/* Submit Butonu */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm font-label-md text-label-md text-white bg-primary hover:bg-primary-container disabled:opacity-50 transition-colors items-center gap-2 cursor-pointer pt-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Kayıt Ol"}
        </button>
      </form>

      {/* Giriş Linki */}
      <div className="pt-4 text-center">
        <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400">
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
  );
};

export default Register;
