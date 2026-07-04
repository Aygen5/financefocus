import React from "react";
import ForecastChart from "@/features/forecast/components/ForecastChart";
import type { ForecastPoint } from "@/features/forecast/components/ForecastChart";
import SavingsTrajectory from "@/features/forecast/components/SavingsTrajectory";
import AiInsights from "@/features/forecast/components/AiInsights";
import Button from "@/components/ui/Button";
import { Sparkles, Sliders, Download } from "lucide-react";
import toast from "react-hot-toast";

const Forecast: React.FC = () => {
  const handleExport = () => {
    toast.success("Tahmin projeksiyon verileri dışa aktarılıyor.");
  };

  const handleAdjustModel = () => {
    toast.success("Tahmin modeli optimizasyonu açıldı.");
  };

  // Mock Projeksiyon Grafik Verisi
  const forecastData: ForecastPoint[] = [
    { year: 2020, historical: 150000 },
    { year: 2021, historical: 220000 },
    { year: 2022, historical: 310000 },
    { year: 2023, historical: 420000 },
    { year: 2024, historical: 550000, projected: 550000 }, // Present Day
    { year: 2025, projected: 680000 },
    { year: 2026, projected: 850000 },
    { year: 2027, projected: 1050000 },
    { year: 2028, projected: 1300000 },
    { year: 2029, projected: 1620000 },
    { year: 2030, projected: 2000000 },
  ];

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">
            Forecast Engine
          </h2>
          <p className="font-body-md text-body-md text-slate-500 flex items-center gap-2 font-medium">
            <span className="text-primary">
              <Sparkles size={16} />
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent font-bold">
              AI-Powered Insights
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Download size={16} />} onClick={handleExport}>
            Export
          </Button>
          <Button variant="outline" icon={<Sliders size={16} />} onClick={handleAdjustModel}>
            Adjust Model
          </Button>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Main Chart Area (Spans 2 columns on lg) */}
        <div className="lg:col-span-2">
          <ForecastChart data={forecastData} />
        </div>

        {/* Side Controls & AI Insights (Spans 1 column) */}
        <div className="flex flex-col gap-gutter">
          <SavingsTrajectory />
          <AiInsights />
        </div>
      </div>
    </div>
  );
};

export default Forecast;
