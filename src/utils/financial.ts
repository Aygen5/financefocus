/* eslint-disable no-console */
/**
 * Finansal hesaplama ve formatlama yardımcı fonksiyonları
 */

/**
 * Sayısal bir tutarı para birimi formatına dönüştürür.
 * Örn: 15250.5 -> 15.250,50 ₺ veya $15,250.50
 */
export const formatCurrency = (amount: number, currency = "TRY", locale = "tr-TR"): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error("Format Currency Error:", error);
    return `${amount.toFixed(2)} ${currency}`;
  }
};

/**
 * İki değer arasındaki yüzde oranını hesaplar.
 * Örn: (150, 1000) -> 15 (%15)
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * İki dönem arasındaki değişim oranını (trend) hesaplar.
 * Örn: (120, 100) -> 20 (%20 artış)
 * Örn: (80, 100) -> -20 (%20 azalış)
 */
export const calculateTrend = (current: number, previous: number): number => {
  if (!previous || previous === 0) return 0;
  const change = current - previous;
  return Number(((change / previous) * 100).toFixed(1));
};

/**
 * Büyük finansal sayıları kısaltarak gösterir.
 * Örn: 1500000 -> 1.5M, 2500 -> 2.5K
 */
export const formatCompactNumber = (amount: number, locale = "tr-TR"): string => {
  try {
    return new Intl.NumberFormat(locale, {
      notation: "compact",
      compactDisplay: "short",
    }).format(amount);
  } catch (error) {
    console.error("Format Compact Number Error:", error);
    return amount.toString();
  }
};

/**
 * Portföy varlıklarının toplam değerini (Net Worth) hesaplar.
 */
export const calculateNetWorth = (assets: { valueInBaseCurrency: number }[]): number => {
  return assets.reduce((sum, asset) => sum + asset.valueInBaseCurrency, 0);
};

/**
 * Toplam Geliri hesaplar.
 */
export const calculateTotalIncome = (transactions: { type: string; amount: number }[]): number => {
  return transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Toplam Gideri hesaplar.
 */
export const calculateTotalExpenses = (
  transactions: { type: string; amount: number }[],
): number => {
  return transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
};
