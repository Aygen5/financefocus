import React from "react";
import Select from "@/components/ui/Select";

export interface RegionalTabProps {
  language?: string;
  currency?: string;
  timezone?: string;
  onChangeRegional?: (key: string, value: string) => void;
}

const RegionalTab: React.FC<RegionalTabProps> = ({
  language = "English",
  currency = "USD",
  timezone = "Pacific Time",
  onChangeRegional,
}) => {
  return (
    <div className="p-8 space-y-8 text-left">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold leading-tight">
          Regional Settings
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
            { value: "English", label: "English (United States)" },
            { value: "Spanish", label: "Spanish (ES)" },
            { value: "French", label: "French (FR)" },
            { value: "German", label: "German (DE)" },
            { value: "Japanese", label: "Japanese (JP)" },
          ]}
        />

        <Select
          label="Para Birimi (Currency)"
          value={currency}
          onChange={(e) => onChangeRegional?.("currency", e.target.value)}
          options={[
            { value: "USD", label: "USD ($) - United States Dollar" },
            { value: "EUR", label: "EUR (€) - Euro" },
            { value: "GBP", label: "GBP (£) - British Pound" },
            { value: "JPY", label: "JPY (¥) - Japanese Yen" },
          ]}
        />

        <div className="col-span-2">
          <Select
            label="Saat Dilimi (Timezone)"
            value={timezone}
            onChange={(e) => onChangeRegional?.("timezone", e.target.value)}
            options={[
              { value: "Pacific Time", label: "(GMT-08:00) Pacific Time (US & Canada)" },
              { value: "Eastern Time", label: "(GMT-05:00) Eastern Time (US & Canada)" },
              { value: "London", label: "(GMT+00:00) London" },
              { value: "Paris", label: "(GMT+01:00) Paris" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default RegionalTab;
