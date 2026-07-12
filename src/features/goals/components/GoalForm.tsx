import React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const goalFormSchema = zod.object({
  name: zod.string().min(2, "Hedef adı en az 2 karakter olmalıdır."),
  category: zod.string().min(1, "Lütfen bir kategori seçiniz."),
  targetAmount: zod.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    zod
      .number({ invalid_type_error: "Lütfen geçerli bir tutar giriniz." })
      .positive("Hedef tutarı sıfırdan büyük olmalıdır."),
  ),
  currentAmount: zod.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    zod
      .number({ invalid_type_error: "Lütfen geçerli bir tutar giriniz." })
      .min(0, "Mevcut tutar sıfırdan küçük olamaz."),
  ),
  deadline: zod.string().min(1, "Hedef tarihi zorunludur."),
  monthlyContribution: zod.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    zod
      .number({ invalid_type_error: "Lütfen geçerli bir tutar giriniz." })
      .min(0, "Aylık birikim sıfırdan küçük olamaz."),
  ),
  priority: zod.enum(["low", "medium", "high"]),
  status: zod.enum(["active", "completed", "paused"]),
  notes: zod.string().optional(),
  color: zod.string().min(1, "Renk seçimi zorunludur."),
});

export type GoalFormData = zod.infer<typeof goalFormSchema>;

interface GoalFormProps {
  onSubmit: (data: GoalFormData) => void;
  loading?: boolean;
  defaultValues?: Partial<GoalFormData>;
  submitLabel?: string;
}

export const GoalForm: React.FC<GoalFormProps> = ({
  onSubmit,
  loading = false,
  defaultValues,
  submitLabel = "Kaydet",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema) as unknown as Resolver<GoalFormData>,
    defaultValues: {
      name: defaultValues?.name || "",
      category: defaultValues?.category || "Yatırım Hedefi",
      targetAmount: defaultValues?.targetAmount,
      currentAmount: defaultValues?.currentAmount || 0,
      deadline: defaultValues?.deadline || "",
      monthlyContribution: defaultValues?.monthlyContribution || 0,
      priority: defaultValues?.priority || "medium",
      status: defaultValues?.status || "active",
      notes: defaultValues?.notes || "",
      color: defaultValues?.color || "#004ac6",
    },
  });

  const categories = [
    { value: "Acil Durum Fonu", label: "Acil Durum Fonu" },
    { value: "Ev Peşinatı", label: "Ev Peşinatı" },
    { value: "Araç Alımı", label: "Araç Alımı" },
    { value: "Tatil", label: "Tatil" },
    { value: "Eğitim", label: "Eğitim" },
    { value: "Emeklilik", label: "Emeklilik" },
    { value: "Yatırım Hedefi", label: "Yatırım Hedefi" },
    { value: "Özel", label: "Özel Hedef" },
  ];

  const priorities = [
    { value: "low", label: "Düşük Öncelik" },
    { value: "medium", label: "Orta Öncelik" },
    { value: "high", label: "Yüksek Öncelik" },
  ];

  const statuses = [
    { value: "active", label: "Aktif" },
    { value: "completed", label: "Tamamlandı" },
    { value: "paused", label: "Duraklatıldı" },
  ];

  const colorsList = [
    { value: "#004ac6", label: "Kurumsal Mavi" },
    { value: "#16a34a", label: "Zümrüt Yeşili" },
    { value: "#bc4800", label: "Kiremit Rengi" },
    { value: "#8b5cf6", label: "Mor" },
    { value: "#eab308", label: "Altın Sarısı" },
    { value: "#ec4899", label: "Pembe" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <Input
        label="Hedef Adı"
        placeholder="Örn: Ev Peşinatı, Yeni Macbook..."
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
          label="Hedeflenen Tutar (TRY)"
          type="number"
          step="any"
          placeholder="0.00"
          error={errors.targetAmount?.message}
          {...register("targetAmount")}
        />

        <Input
          label="Mevcut Birikim (TRY)"
          type="number"
          step="any"
          placeholder="0.00"
          error={errors.currentAmount?.message}
          {...register("currentAmount")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Hedef Tarihi"
          type="date"
          error={errors.deadline?.message}
          {...register("deadline")}
        />

        <Input
          label="Aylık Düzenli Birikim (Opsiyonel)"
          type="number"
          step="any"
          placeholder="0.00"
          error={errors.monthlyContribution?.message}
          {...register("monthlyContribution")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Öncelik Derecesi"
          options={priorities}
          error={errors.priority?.message}
          {...register("priority")}
        />

        <Select
          label="Durum"
          options={statuses}
          error={errors.status?.message}
          {...register("status")}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
          Notlar / Açıklama
        </label>
        <textarea
          placeholder="Hedefiniz hakkında detaylar yazabilirsiniz..."
          rows={3}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 font-semibold text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder-slate-400 resize-none"
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

export default GoalForm;
