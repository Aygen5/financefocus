import React from "react";
import Select from "@/components/ui/Select";

export interface RegionalTabProps {
  language?: string;
  currency?: string;
  timezone?: string;
  dateFormat?: string;
  numberFormat?: string;
  onChangeRegional?: (key: string, value: string) => void;
}

const RegionalTab: React.FC<RegionalTabProps> = ({
  language = "Turkish",
  currency = "TRY",
  timezone = "Europe/Istanbul",
  dateFormat = "dd.MM.yyyy",
  numberFormat = "Turkish",
  onChangeRegional,
}) => {
  return (
    <div className="p-8 space-y-8 text-left select-none">
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
            { value: "English", label: "English (US)" },
          ]}
        />

        <Select
          label="Para Birimi (Currency)"
          value={currency}
          onChange={(e) => onChangeRegional?.("currency", e.target.value)}
          options={[
            { value: "TRY", label: "TRY (₺) - Türk Lirası" },
            { value: "USD", label: "USD ($) - Amerikan Doları" },
            { value: "EUR", label: "EUR (€) - Euro" },
          ]}
        />

        <Select
          label="Saat Dilimi (Timezone)"
          value={timezone}
          onChange={(e) => onChangeRegional?.("timezone", e.target.value)}
          options={[
            { value: "Europe/Istanbul", label: "(GMT+03:00) Europe/Istanbul" },
            { value: "UTC", label: "(GMT+00:00) Coordinated Universal Time" },
            { value: "Europe/London", label: "(GMT+00:00) Europe/London" },
          ]}
        />

        <Select
          label="Tarih Biçimi (Date Format)"
          value={dateFormat}
          onChange={(e) => onChangeRegional?.("dateFormat", e.target.value)}
          options={[
            { value: "dd.MM.yyyy", label: "dd.MM.yyyy (31.12.2026)" },
            { value: "yyyy-MM-dd", label: "yyyy-MM-dd (2026-12-31)" },
            { value: "MM/dd/yyyy", label: "MM/dd/yyyy (12/31/2026)" },
          ]}
        />

        <div className="col-span-2">
          <Select
            label="Sayı Biçimi (Number Format)"
            value={numberFormat}
            onChange={(e) => onChangeRegional?.("numberFormat", e.target.value)}
            options={[
              { value: "Turkish", label: "Türkçe Standardı (1.234,56)" },
              { value: "English", label: "İngilizce Standardı (1,234.56)" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default RegionalTab;
