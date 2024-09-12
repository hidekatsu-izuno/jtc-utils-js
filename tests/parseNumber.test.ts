import { describe, expect, test } from "vitest";
import { de, enUS, fr } from "../src/locale/index.js";
import { parseNumber } from "../src/parseNumber.js";

describe("parseNumber", () => {
  test("test parsing no formats", () => {
    expect(parseNumber("1,000.01")).toBe(1000.01);
    expect(parseNumber("01,000.01")).toBe(1000.01);
  });

  test("test parse from string", () => {
    expect(parseNumber("0", "######")).toBe(0);
    expect(parseNumber("0", "###,###")).toBe(0);
    expect(parseNumber("0", "###,###.#")).toBe(0);
    expect(parseNumber("0.0", "###,###.#")).toBe(0);
    expect(parseNumber("0.01", "###,###.#")).toBe(0.01);
    expect(parseNumber("0", "###,###.0")).toBe(0);
    expect(parseNumber("0.0", "###,###.0")).toBe(0);
    expect(parseNumber("0.01", "###,###.0")).toBe(0.01);

    expect(parseNumber("10000", "######")).toBe(10000);
    expect(parseNumber("10,000", "###,###")).toBe(10000);
    expect(parseNumber("10,000", "###,###.#")).toBe(10000);
    expect(parseNumber("10,000.0", "###,###.0")).toBe(10000);

    expect(parseNumber("-10000", "######")).toBe(-10000);
    expect(parseNumber("-10,000", "###,###")).toBe(-10000);
    expect(parseNumber("-10,000", "###,###.#")).toBe(-10000);
    expect(parseNumber("-10,000.0", "###,###.0")).toBe(-10000);
  });

  test("test parsing special formats", () => {
    expect(parseNumber("(1,000.01)", "###,###.##;(###,###.##)")).toBe(-1000.01);
  });

  test("test localized format from number to string", () => {
    expect(parseNumber("1,000.01", "###,###.##", { locale: enUS })).toBe(
      1000.01,
    );
    expect(parseNumber("1\u202f000,01", "###,###.##", { locale: fr })).toBe(
      1000.01,
    );
    expect(parseNumber("1.000,01", "###,###.##", { locale: de })).toBe(1000.01);
  });
});
