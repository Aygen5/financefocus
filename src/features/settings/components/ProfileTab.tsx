import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema } from "../settings.types";
import type { ProfileFormData } from "../settings.types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User } from "lucide-react";
import toast from "react-hot-toast";

export interface ProfileTabProps {
  initialData?: ProfileFormData;
  onSave?: (data: ProfileFormData) => Promise<void>;
  loading?: boolean;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  initialData = { fullName: "Alex Rivera", email: "alex.rivera@financefocus.com", bio: "" },
  onSave,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (onSave) {
      await onSave(data);
    } else {
      toast.success("Profil bilgileri kaydedildi!");
    }
  };

  const handleUploadPhoto = () => {
    toast.success("Fotoğraf yükleme penceresi açıldı.");
  };

  const handleRemovePhoto = () => {
    toast.success("Profil fotoğrafı kaldırıldı.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold leading-tight">
            Public Profile
          </h3>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
            Fotoğrafınızı ve kişisel bilgilerinizi güncelleyin.
          </p>
        </div>
        <Button variant="primary" type="submit" loading={isSubmitting || loading}>
          Save Changes
        </Button>
      </div>

      {/* Profile Picture */}
      <div className="flex items-center gap-8 py-6 border-y border-slate-100 dark:border-slate-800/80">
        <div className="relative group select-none">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-primary/10 flex items-center justify-center overflow-hidden">
            <User size={32} className="text-slate-400" />
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="font-label-md text-label-md text-slate-800 dark:text-white font-bold">
            Profil Fotoğrafı
          </h4>
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            PNG, JPG formatlarında en fazla 10MB
          </p>
          <div className="flex gap-3 mt-2 font-bold text-xs">
            <button
              type="button"
              onClick={handleUploadPhoto}
              className="text-primary dark:text-brand-400 hover:underline cursor-pointer"
            >
              Yeni Yükle
            </button>
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="text-red-650 hover:underline cursor-pointer"
            >
              Kaldır
            </button>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-6">
        <Input
          label="Ad Soyad"
          placeholder="Ad Soyad"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <Input
          label="E-posta Adresi"
          type="email"
          placeholder="E-posta Adresi"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="col-span-2 space-y-2">
          <label className="font-label-sm text-label-sm text-slate-500 font-bold block">
            Hakkında (Bio)
          </label>
          <textarea
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24 text-slate-800 dark:text-white font-medium placeholder-slate-400 text-sm"
            placeholder="Hakkınızda kısa bilgi girin..."
            {...register("bio")}
          />
        </div>
      </div>
    </form>
  );
};

export default ProfileTab;
