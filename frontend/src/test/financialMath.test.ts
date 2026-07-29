import { describe, it, expect } from "vitest";
import {
  getTransactionTypeInfo,
  calculateTotalIncome,
  calculateTotalExpense,
  calculateNetCashFlow,
  calculateSavingsRate,
  formatSignedCurrency,
} from "../utils/financialMath";

describe("financialMath Enterprise Domain Engine", () => {
  describe("getTransactionTypeInfo", () => {
    it("should correctly evaluate Income (string, number, case-insensitive)", () => {
      const infoStr = getTransactionTypeInfo("income", 150000);
      expect(infoStr.isIncome).toBe(true);
      expect(infoStr.sign).toBe("+");
      expect(infoStr.signedAmount).toBe(150000);
      expect(infoStr.label).toBe("Gelir");

      const infoNum = getTransactionTypeInfo(0, 150000);
      expect(infoNum.isIncome).toBe(true);
      expect(infoNum.sign).toBe("+");
    });

    it("should correctly evaluate Expense (string, number, case-insensitive)", () => {
      const infoStr = getTransactionTypeInfo("expense", 10000);
      expect(infoStr.isExpense).toBe(true);
      expect(infoStr.sign).toBe("-");
      expect(infoStr.signedAmount).toBe(-10000);
      expect(infoStr.label).toBe("Gider");

      const infoNum = getTransactionTypeInfo(1, 10000);
      expect(infoNum.isExpense).toBe(true);
      expect(infoNum.sign).toBe("-");
    });

    it("should correctly evaluate Transfer/Neutral without altering income/expense", () => {
      const infoTransfer = getTransactionTypeInfo("transfer", 5000);
      expect(infoTransfer.isTransfer).toBe(true);
      expect(infoTransfer.isIncome).toBe(false);
      expect(infoTransfer.isExpense).toBe(false);
      expect(infoTransfer.sign).toBe("");
      expect(infoTransfer.signedAmount).toBe(0);
      expect(infoTransfer.label).toBe("Transfer");

      const infoNeutral = getTransactionTypeInfo("neutral", 5000);
      expect(infoNeutral.isTransfer).toBe(true);
    });
  });

  describe("Scenario 1: Single Income (150,000 TL)", () => {
    const transactions = [{ amount: 150000, transactionType: "income", category: "MAAŞ" }];

    it("should produce Gelir = 150,000, Gider = 0, Savings = 150,000", () => {
      const income = calculateTotalIncome(transactions);
      const expense = calculateTotalExpense(transactions);
      const net = calculateNetCashFlow(transactions);
      const savingsRate = calculateSavingsRate(income, expense);

      expect(income).toBe(150000);
      expect(expense).toBe(0);
      expect(net).toBe(150000);
      expect(savingsRate).toBe(100);
    });
  });

  describe("Scenario 2: Income (150,000 TL) + Expense (10,000 TL)", () => {
    const transactions = [
      { amount: 150000, transactionType: "income", category: "MAAŞ" },
      { amount: 10000, transactionType: "expense", category: "Kira" },
    ];

    it("should produce Gelir = 150,000, Gider = 10,000, Savings = 140,000, Net = 140,000", () => {
      const income = calculateTotalIncome(transactions);
      const expense = calculateTotalExpense(transactions);
      const net = calculateNetCashFlow(transactions);
      const savingsRate = calculateSavingsRate(income, expense);

      expect(income).toBe(150000);
      expect(expense).toBe(10000);
      expect(net).toBe(140000);
      expect(savingsRate).toBe(93.33);
    });
  });

  describe("Scenario 3: Adding Transfer does not alter Income, Expense, or Net", () => {
    const baseTransactions = [
      { amount: 150000, transactionType: "income" },
      { amount: 10000, transactionType: "expense" },
    ];

    const withTransfer = [...baseTransactions, { amount: 25000, transactionType: "transfer" }];

    it("should yield identical Income, Expense, and Net Cash Flow after adding Transfer", () => {
      const incomeBase = calculateTotalIncome(baseTransactions);
      const expenseBase = calculateTotalExpense(baseTransactions);
      const netBase = calculateNetCashFlow(baseTransactions);

      const incomeTrans = calculateTotalIncome(withTransfer);
      const expenseTrans = calculateTotalExpense(withTransfer);
      const netTrans = calculateNetCashFlow(withTransfer);

      expect(incomeTrans).toBe(incomeBase);
      expect(expenseTrans).toBe(expenseBase);
      expect(netTrans).toBe(netBase);
    });
  });

  describe("Formatters", () => {
    it("should format signed currency properly", () => {
      expect(formatSignedCurrency(150000, "income")).toContain("+");
      expect(formatSignedCurrency(10000, "expense")).toContain("-");
    });
  });
});
