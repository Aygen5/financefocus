/**
 * Safely normalizes text for search matching.
 * Handles null, undefined, numeric inputs, case-insensitivity, and Turkish special characters.
 */
export const normalizeForSearch = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  return String(value)
    .toLowerCase()
    .replace(/i̇/g, "i")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .trim();
};
