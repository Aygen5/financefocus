import React from "react";
import { Landmark, CreditCard, Banknote, Wallet } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { formatCurrency } from "@/utils/financial";

export interface SummaryCardsProps {
  netWorth: number;
  income: number;
  expenses: number;
  savings: number;
  loading?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  netWorth,
  income,
  expenses,
  savings,
  loading = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
      {/* Net Worth */}
      <StatCard
        title="Toplam Varlık (Net Worth)"
        value={formatCurrency(netWorth, "USD", "en-US")}
        loading={loading}
        change={2.4}
        changeLabel="geçen aya göre"
        icon={<Landmark size={18} className="text-primary" />}
      />

      {/* Income */}
      <StatCard
        title="Aylık Gelir"
        value={formatCurrency(income, "USD", "en-US")}
        loading={loading}
        icon={<Banknote size={18} className="text-emerald-500" />}
      />

      {/* Expenses */}
      <StatCard
        title="Aylık Giderler"
        value={formatCurrency(expenses, "USD", "en-US")}
        loading={loading}
        icon={<CreditCard size={18} className="text-red-550" />}
      />

      {/* Savings */}
      <StatCard
        title="Toplam Tasarruf"
        value={formatCurrency(savings, "USD", "en-US")}
        loading={loading}
        icon={<Wallet size={18} className="text-brand-500" />}
      />
    </div>
  );
};

export default SummaryCards;
