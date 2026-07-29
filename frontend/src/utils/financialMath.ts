/**
 * ENTERPRISE SINGLE SOURCE OF TRUTH FINANCIAL MATH HELPER
 *
 * Provides unified, deterministic financial calculations, sign resolutions,
 * and transaction type evaluations across the entire FinanceFocus frontend application.
 */

export type DomainTransactionType = "income" | "expense" | "transfer";

export interface TransactionTypeInfo {
  type: DomainTransactionType;
  isIncome: boolean;
  isExpense: boolean;
  isTransfer: boolean;
  sign: "+" | "-" | "";
  signedAmount: number;
  colorClass: string;
  badgeVariant: "success" | "danger" | "secondary";
  label: string;
}

export interface GenericTransaction {
  amount: number;
  transactionType?: string | number;
  type?: string | number;
  date?: string;
  category?: string;
}

/**
 * Single Source of Truth for resolving Transaction Type, Sign, Color, and Label.
 */
export const getTransactionTypeInfo = (
  rawType: string | number | undefined,
  amount: number = 0,
): TransactionTypeInfo => {
  const absAmount = Math.abs(amount || 0);

  if (rawType === undefined || rawType === null) {
    return {
      type: "expense",
      isIncome: false,
      isExpense: true,
      isTransfer: false,
      sign: "-",
      signedAmount: -absAmount,
      colorClass: "text-red-500 dark:text-red-400",
      badgeVariant: "danger",
      label: "Gider",
    };
  }

  const strType = String(rawType).trim().toLowerCase();

  const isIncome = strType === "income" || strType === "0" || rawType === 0;
  const isTransfer =
    strType === "transfer" || strType === "neutral" || strType === "2" || rawType === 2;

  if (isIncome) {
    return {
      type: "income",
      isIncome: true,
      isExpense: false,
      isTransfer: false,
      sign: "+",
      signedAmount: absAmount,
      colorClass: "text-emerald-500 dark:text-emerald-400",
      badgeVariant: "success",
      label: "Gelir",
    };
  }

  if (isTransfer) {
    return {
      type: "transfer",
      isIncome: false,
      isExpense: false,
      isTransfer: true,
      sign: "",
      signedAmount: 0,
      colorClass: "text-slate-500 dark:text-slate-400",
      badgeVariant: "secondary",
      label: "Transfer",
    };
  }

  // Default to Expense
  return {
    type: "expense",
    isIncome: false,
    isExpense: true,
    isTransfer: false,
    sign: "-",
    signedAmount: -absAmount,
    colorClass: "text-red-500 dark:text-red-400",
    badgeVariant: "danger",
    label: "Gider",
  };
};

/**
 * Calculates total income from a list of transactions (strictly Income types).
 */
export const calculateTotalIncome = (transactions: GenericTransaction[]): number => {
  if (!Array.isArray(transactions)) return 0;
  return transactions.reduce((sum, tx) => {
    const info = getTransactionTypeInfo(tx.transactionType ?? tx.type, tx.amount);
    return info.isIncome ? sum + Math.abs(tx.amount || 0) : sum;
  }, 0);
};

/**
 * Calculates total expense from a list of transactions (strictly Expense types).
 */
export const calculateTotalExpense = (transactions: GenericTransaction[]): number => {
  if (!Array.isArray(transactions)) return 0;
  return transactions.reduce((sum, tx) => {
    const info = getTransactionTypeInfo(tx.transactionType ?? tx.type, tx.amount);
    return info.isExpense ? sum + Math.abs(tx.amount || 0) : sum;
  }, 0);
};

/**
 * Calculates net cash flow (Total Income - Total Expense). Transfers contribute 0.
 */
export const calculateNetCashFlow = (transactions: GenericTransaction[]): number => {
  const income = calculateTotalIncome(transactions);
  const expense = calculateTotalExpense(transactions);
  return income - expense;
};

/**
 * Calculates savings rate percentage: (Net Savings / Income) * 100.
 */
export const calculateSavingsRate = (income: number, expense: number): number => {
  if (!income || income <= 0) return 0;
  const netSavings = income - expense;
  const rate = (netSavings / income) * 100;
  return Number(Math.max(0, rate).toFixed(2));
};

/**
 * Formats monetary amounts with standardized Turkish Lira locale.
 */
export const formatCurrency = (amount: number): string => {
  const safeNum = isNaN(amount) || amount === null || amount === undefined ? 0 : amount;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeNum);
};

/**
 * Formats monetary amounts with sign (+ / -).
 */
export const formatSignedCurrency = (amount: number, rawType?: string | number): string => {
  const info = getTransactionTypeInfo(rawType, amount);
  const formatted = formatCurrency(Math.abs(amount || 0));
  if (info.isIncome) return `+${formatted}`;
  if (info.isExpense) return `-${formatted}`;
  return formatted;
};
