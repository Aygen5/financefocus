import { describe, it, expect } from "vitest";
import { normalizeForSearch } from "../utils/search";

describe("normalizeForSearch", () => {
  it("should handle null and undefined safely without throwing", () => {
    expect(normalizeForSearch(null)).toBe("");
    expect(normalizeForSearch(undefined)).toBe("");
  });

  it("should handle empty string safely", () => {
    expect(normalizeForSearch("")).toBe("");
  });

  it("should normalize upper/lower case text", () => {
    expect(normalizeForSearch("Maaş Ödemesi")).toBe("maas odemesi");
    expect(normalizeForSearch("BÜTÇE HEDEFİ")).toBe("butce hedefi");
  });

  it("should normalize Turkish special characters (ö, ü, ş, ç, ı, ğ, İ)", () => {
    expect(normalizeForSearch("İşlem")).toBe("islem");
    expect(normalizeForSearch("Şekerbank")).toBe("sekerbank");
    expect(normalizeForSearch("Çıkış")).toBe("cikis");
    expect(normalizeForSearch("Öğle Yemeği")).toBe("ogle yemegi");
    expect(normalizeForSearch("Süpermarket")).toBe("supermarket");
  });

  it("should convert numeric inputs safely", () => {
    expect(normalizeForSearch(15000)).toBe("15000");
    expect(normalizeForSearch(0)).toBe("0");
  });

  it("should enable matching between Turkish accented and unaccented search queries", () => {
    const itemTitle = "Müşteri Hakediş Ödemesi";
    const queryWithAccents = "müşteri";
    const queryWithoutAccents = "musteri";

    const normalizedTitle = normalizeForSearch(itemTitle);
    expect(normalizedTitle.includes(normalizeForSearch(queryWithAccents))).toBe(true);
    expect(normalizedTitle.includes(normalizeForSearch(queryWithoutAccents))).toBe(true);
  });
});
