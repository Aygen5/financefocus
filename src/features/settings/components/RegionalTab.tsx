import React from "react";
import Select from "@/components/ui/Select";

export interface RegionalTabProps {
  language?: string;
  currency?: string;
  timezone?: string;
  onChangeRegional?: (key: string, value: string) => void;
}

const RegionalTab: React.FC<RegionalTabProps> = ({
  language = "Turkish",
  currency = "TRY",
  timezone = "Europe/Istanbul",
  onChangeRegional,
}) => {
  return (
    <div className="p-8 space-y-8 text-left">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold leading-tight">
          Bölgesel Ayarlar
        </h3>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
          Tercih ettiğiniz dili ve para birimi formatlarını yapılandırın.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Select
          label="Dil (Language)"
          value={language}
          onChange={(e) => onChangeRegional?.("language", e.target.value)}
          options={[
            { value: "Turkish", label: "Türkçe (TR)" },
            { value: "English", label: "English (United States)" },
          ]}
        />

        <Select
          label="Para Birimi (Currency)"
          value={currency}
          onChange={(e) => onChangeRegional?.("currency", e.target.value)}
          options={[{ value: "TRY", label: "TRY (₺) - Türk Lirası" }]}
        />

        <div className="col-span-2">
          <Select
            label="Saat Dilimi (Timezone)"
            value={timezone}
            onChange={(e) => onChangeRegional?.("timezone", e.target.value)}
            options={[{ value: "Europe/Istanbul", label: "(GMT+03:00) Europe/Istanbul" }]}
          />
        </div>
      </div>
    </div>
  );
};

export default RegionalTab;
