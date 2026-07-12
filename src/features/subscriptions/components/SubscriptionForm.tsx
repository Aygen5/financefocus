import React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const subscriptionFormSchema = zod.object({
  name: zod.string().min(2, "Servis adı en az 2 karakter olmalıdır."),
  cost: zod.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    zod
      .number({ invalid_type_error: "Lütfen geçerli bir tutar giriniz." })
      .positive("Ücret sıfırdan büyük olmalıdır."),
  ),
  billingCycle: zod.enum(["monthly", "yearly"]),
  nextBillingDate: zod.string().min(1, "Sonraki ödeme tarihi zorunludur."),
  category: zod.string().min(1, "Lütfen bir kategori seçiniz."),
  billingType: zod.string().min(1, "Ödeme yöntemi zorunludur."),
  autoRenew: zod.boolean().default(true),
  startDate: zod.string().optional(),
  status: zod.enum(["active", "paused", "cancelled"]),
  notes: zod.string().optional(),
  color: zod.string().min(1, "Renk teması zorunludur."),
});

export type SubscriptionFormData = zod.infer<typeof subscriptionFormSchema>;

interface SubscriptionFormProps {
  onSubmit: (data: SubscriptionFormData) => void;
  loading?: boolean;
  defaultValues?: Partial<SubscriptionFormData>;
  submitLabel?: string;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onSubmit,
  loading = false,
  defaultValues,
  submitLabel = "Kaydet",
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionFormSchema) as unknown as Resolver<SubscriptionFormData>,
    defaultValues: {
      name: defaultValues?.name || "",
      cost: defaultValues?.cost,
      billingCycle: defaultValues?.billingCycle || "monthly",
      nextBillingDate: defaultValues?.nextBillingDate || "",
      category: defaultValues?.category || "Software",
      billingType: defaultValues?.billingType || "Kredi Kartı",
      autoRenew: defaultValues?.autoRenew !== undefined ? defaultValues.autoRenew : true,
      startDate: defaultValues?.startDate || new Date().toISOString().split("T")[0],
      status: defaultValues?.status || "active",
      notes: defaultValues?.notes || "",
      color: defaultValues?.color || "#004ac6",
    },
  });

  const categories = [
    { value: "Video", label: "Video (Netflix, YouTube vb.)" },
    { value: "Music", label: "Müzik (Spotify, Apple Music)" },
    { value: "Cloud", label: "Bulut Depolama (iCloud, Drive)" },
    { value: "AI", label: "Yapay Zeka (ChatGPT, Claude)" },
    { value: "Software", label: "Yazılım / SaaS (Satis, JetBrains)" },
    { value: "Education", label: "Eğitim (Udemy, Coursera)" },
    { value: "Gaming", label: "Oyun (Xbox Pass, PlayStation)" },
    { value: "Finance", label: "Finans / Yatırım (TradingView)" },
    { value: "Other", label: "Diğer Abonelikler" },
  ];

  const cycles = [
    { value: "monthly", label: "Aylık Ödeme" },
    { value: "yearly", label: "Yıllık Ödeme" },
  ];

  const statuses = [
    { value: "active", label: "Aktif" },
    { value: "paused", label: "Duraklatıldı" },
    { value: "cancelled", label: "İptal Edildi" },
  ];

  const colorsList = [
    { value: "#004ac6", label: "Kurumsal Mavi" },
    { value: "#16a34a", label: "Zümrüt Yeşili" },
    { value: "#bc4800", label: "Kiremit Rengi" },
    { value: "#8b5cf6", label: "Mor" },
    { value: "#eab308", label: "Altın Sarısı" },
    { value: "#ec4899", label: "Pembe" },
  ];

  const autoRenewVal = watch("autoRenew");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <Input
        label="Servis / Abonelik Adı"
        placeholder="Örn: Netflix, Spotify, ChatGPT..."
        error={errors.name?.message}
        {...register("name")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Kategori"
          options={categories}
          error={errors.category?.message}
          {...register("category")}
        />

        <Select
          label="Renk Teması"
          options={colorsList}
          error={errors.color?.message}
          {...register("color")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Abonelik Ücreti (TRY)"
          type="number"
          step="any"
          placeholder="0.00"
          error={errors.cost?.message}
          {...register("cost")}
        />

        <Select
          label="Ödeme Periyodu"
          options={cycles}
          error={errors.billingCycle?.message}
          {...register("billingCycle")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Sonraki Ödeme Tarihi"
          type="date"
          error={errors.nextBillingDate?.message}
          {...register("nextBillingDate")}
        />

        <Input
          label="Başlangıç Tarihi"
          type="date"
          error={errors.startDate?.message}
          {...register("startDate")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Ödeme Yöntemi"
          placeholder="Örn: Yapı Kredi Kredi Kartı"
          error={errors.billingType?.message}
          {...register("billingType")}
        />

        <Select
          label="Durum"
          options={statuses}
          error={errors.status?.message}
          {...register("status")}
        />
      </div>

      <div className="flex items-center gap-2 select-none pt-2">
        <input
          id="autoRenew"
          type="checkbox"
          checked={autoRenewVal}
          onChange={(e) => setValue("autoRenew", e.target.checked)}
          className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer"
        />
        <label
          htmlFor="autoRenew"
          className="text-xs font-bold text-slate-650 dark:text-slate-350 cursor-pointer"
        >
          Otomatik Yenile (Auto-Renew)
        </label>
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
          Açıklama / Notlar
        </label>
        <textarea
          placeholder="Abonelik hakkında ek notlar veya ödeme detayları..."
          rows={3}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 font-semibold text-xs text-slate-700 dark:text-slate-205 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder-slate-400 resize-none"
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 select-none">
        <Button variant="primary" type="submit" loading={loading} className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default SubscriptionForm;
