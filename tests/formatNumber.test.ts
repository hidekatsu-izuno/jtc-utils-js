import { describe, expect, test } from "vitest";
import { formatNumber } from "../src/formatNumber.js";
import { de, enUS, fr } from "../src/locale/index.js";

describe("formatNumber", () => {
  test("test format from number to string", () => {
    expect(formatNumber(0, "######")).toBe("0");
    expect(formatNumber(0, "###,###")).toBe("0");
    expect(formatNumber(0, "###,###.#")).toBe("0");
    expect(formatNumber(0, "###,###.0")).toBe("0.0");
    expect(formatNumber(0, "##,##,##.#")).toBe("0");

    expect(formatNumber(10000, "######")).toBe("10000");
    expect(formatNumber(10000, "###,###")).toBe("10,000");
    expect(formatNumber(10000, "###,###.#")).toBe("10,000");
    expect(formatNumber(10000, "###,###.0")).toBe("10,000.0");
    expect(formatNumber(10000, "##,##,##.#")).toBe("1,00,00");

    expect(formatNumber(-10000, "######")).toBe("-10000");
    expect(formatNumber(-10000, "###,###")).toBe("-10,000");
    expect(formatNumber(-10000, "###,###.#")).toBe("-10,000");
    expect(formatNumber(-10000, "###,###.0")).toBe("-10,000.0");
    expect(formatNumber(-10000, "##,##,##.#")).toBe("-1,00,00");

    expect(formatNumber(-10000, "0000000")).toBe("-0010000");
    expect(formatNumber(10000, "0,000,000")).toBe("0,010,000");
    expect(formatNumber(-10000, "0,000,000.#")).toBe("-0,010,000");
    expect(formatNumber(10000, "0,000,000.0")).toBe("0,010,000.0");
    expect(formatNumber(-10000, "00,00,00.#")).toBe("-01,00,00");

    expect(formatNumber(-10000, "*******")).toBe("*-10000");
  });

  test("test localized format from number to string", () => {
    expect(formatNumber(1000.01, "###,###.##", { locale: enUS })).toBe(
      "1,000.01",
    );
    expect(formatNumber(1000.01, "###,###.##", { locale: fr })).toBe(
      "1\u202f000,01",
    );
    expect(formatNumber(1000.01, "###,###.##", { locale: de })).toBe(
      "1.000,01",
    );
  });
});
