import React, { useRef } from "react";
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
  initialData = {
    fullName: "Alex Rivera",
    email: "alex.rivera@financefocus.com",
    bio: "",
    profilePicture: "",
  },
  onSave,
  loading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
  });

  const profilePicture = watch("profilePicture");

  const onSubmit = async (data: ProfileFormData) => {
    if (onSave) {
      await onSave(data);
    } else {
      toast.success("Profil bilgileri kaydedildi!");
    }
  };

  const handleUploadPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Format control (PNG, JPG, JPEG)
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Yalnızca PNG ve JPG formatları desteklenmektedir!");
      return;
    }

    // Size control (Max 10MB)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error("Dosya boyutu maksimum 10MB olmalıdır!");
      return;
    }

    // Read file as Base64 Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setValue("profilePicture", event.target.result as string);
        toast.success("Profil fotoğrafı yüklendi!");
      }
    };
    reader.onerror = () => {
      toast.error("Fotoğraf okunurken bir hata oluştu.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setValue("profilePicture", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Profil fotoğrafı kaldırıldı.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8 text-left select-none">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold leading-tight">
            Kamu Profili
          </h3>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
            Fotoğrafınızı ve kişisel bilgilerinizi güncelleyin.
          </p>
        </div>
        <Button variant="primary" type="submit" loading={isSubmitting || loading}>
          Değişiklikleri Kaydet
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Profile Picture */}
      <div className="flex items-center gap-8 py-6 border-y border-slate-100 dark:border-slate-800/80">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-primary/10 flex items-center justify-center overflow-hidden">
            {profilePicture ? (
              <img src={profilePicture} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-slate-400" />
            )}
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
              onClick={handleUploadPhotoClick}
              className="text-primary dark:text-brand-400 hover:underline cursor-pointer"
            >
              Yeni Yükle
            </button>
            {profilePicture && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-red-650 hover:underline cursor-pointer"
              >
                Kaldır
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-6">
        <Input
          label="Ad Soyad"
          placeholder="Ad Soyad"
          {...register("fullName")}
          error={errors.fullName?.message}
        />
        <Input
          label="E-posta Adresi"
          placeholder="E-posta Adresi"
          {...register("email")}
          error={errors.email?.message}
        />
        <div className="col-span-2">
          <Input
            label="Kısa Biyografi (Bio)"
            placeholder="Kendinizden bahsedin..."
            {...register("bio")}
            error={errors.bio?.message}
          />
        </div>
      </div>
    </form>
  );
};

export default ProfileTab;
