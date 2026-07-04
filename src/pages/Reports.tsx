import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchReports } from "@/features/reports/reportsSlice";
import ReportsSummary from "@/features/reports/components/ReportsSummary";
import ExpenseBreakdown from "@/features/reports/components/ExpenseBreakdown";
import type { ExpenseBreakdownItem } from "@/features/reports/components/ExpenseBreakdown";
import IncomeVsProjected from "@/features/reports/components/IncomeVsProjected";
import type { IncomeVsProjectedPoint } from "@/features/reports/components/IncomeVsProjected";
import SavingsAnalysis from "@/features/reports/components/SavingsAnalysis";
import RecentReportsTable from "@/features/reports/components/RecentReportsTable";
import ReportBuilderAd from "@/features/reports/components/ReportBuilderAd";
import Button from "@/components/ui/Button";
import { FileSpreadsheet, FileText } from "lucide-react";
import toast from "react-hot-toast";

const Reports: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: reports, loading } = useAppSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleExcelExport = () => {
    toast.success("Excel Raporu üretiliyor...");
  };

  const handlePdfExport = () => {
    toast.success("PDF Raporu üretiliyor...");
  };

  const handleDownload = (id: string) => {
    toast.success(`Rapor indiriliyor: ${id}`);
  };

  const handleViewAll = () => {
    toast.success("Tüm raporlar listeleniyor.");
  };

  const handleBuildReport = () => {
    toast.success("Report Builder modülü açılıyor.");
  };

  // Mock Grafikler Veri Setleri
  const expenseData: ExpenseBreakdownItem[] = [
    { name: "Housing & Utilities", value: 5964, color: "#004ac6" },
    { name: "Food & Dining", value: 2130, color: "#505f76" },
    { name: "Transportation", value: 1420, color: "#bc4800" },
  ];

  const incomeData: IncomeVsProjectedPoint[] = [
    { month: "Mar", income: 38000, projected: 40000 },
    { month: "Apr", income: 44000, projected: 42000 },
    { month: "May", income: 42000, projected: 45000 },
    { month: "Jun", income: 51000, projected: 48000 },
    { month: "Jul", income: 55000, projected: 52000 },
    { month: "Aug", income: 64000, projected: 58000 },
  ];

  return (
    <div className="w-full max-w-container-max mx-auto space-y-gutter text-left">
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Financial Reports</h2>
          <p className="font-body-md text-body-md text-slate-500 font-medium">
            Comprehensive insights and performance analytics for Q3 2023.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<FileSpreadsheet size={18} />}
            onClick={handleExcelExport}
          >
            Generate Excel
          </Button>
          <Button variant="primary" icon={<FileText size={18} />} onClick={handlePdfExport}>
            Generate PDF
          </Button>
        </div>
      </div>

      {/* Bento Grid Top Summary */}
      <ReportsSummary
        netWorth={1248500}
        expenses={14200}
        savingsProgress={84.2}
        riskScore="Low (1.2)"
        loading={loading}
      />

      {/* Expense & Income Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <ExpenseBreakdown data={expenseData} loading={loading} />
        <div className="lg:col-span-2">
          <IncomeVsProjected data={incomeData} loading={loading} />
        </div>
      </div>

      {/* Savings & Recent Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <SavingsAnalysis retirement={78} emergency={100} realEstate={34} loading={loading} />
        <div className="lg:col-span-2">
          <RecentReportsTable
            reports={reports}
            loading={loading}
            onDownload={handleDownload}
            onViewAll={handleViewAll}
          />
        </div>
      </div>

      {/* Custom report builder promotion card */}
      <ReportBuilderAd onBuildReport={handleBuildReport} />
    </div>
  );
};

export default Reports;
