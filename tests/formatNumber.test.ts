import assert from "node:assert/strict";
import { describe, expect, test } from "vitest";
import { formatNumber } from "../src/formatNumber.js";
import { de, enUS, fr } from "../src/locale/index.js";

describe("formatNumber", () => {
  test("test format from number to string", () => {
    assert.equal(formatNumber(0, "######"), "0");
    assert.equal(formatNumber(0, "###,###"), "0");
    assert.equal(formatNumber(0, "###,###.#"), "0");
    assert.equal(formatNumber(0, "###,###.0"), "0.0");
    assert.equal(formatNumber(0, "##,##,##.#"), "0");

    assert.equal(formatNumber(10000, "######"), "10000");
    assert.equal(formatNumber(10000, "###,###"), "10,000");
    assert.equal(formatNumber(10000, "###,###.#"), "10,000");
    assert.equal(formatNumber(10000, "###,###.0"), "10,000.0");
    assert.equal(formatNumber(10000, "##,##,##.#"), "1,00,00");

    assert.equal(formatNumber(-10000, "######"), "-10000");
    assert.equal(formatNumber(-10000, "###,###"), "-10,000");
    assert.equal(formatNumber(-10000, "###,###.#"), "-10,000");
    assert.equal(formatNumber(-10000, "###,###.0"), "-10,000.0");
    assert.equal(formatNumber(-10000, "##,##,##.#"), "-1,00,00");

    assert.equal(formatNumber(-10000, "0000000"), "-0010000");
    assert.equal(formatNumber(10000, "0,000,000"), "0,010,000");
    assert.equal(formatNumber(-10000, "0,000,000.#"), "-0,010,000");
    assert.equal(formatNumber(10000, "0,000,000.0"), "0,010,000.0");
    assert.equal(formatNumber(-10000, "00,00,00.#"), "-01,00,00");
  });

  test("test localized format from number to string", () => {
    assert.equal(formatNumber(1000.01, "###,###.##", { locale: enUS }), 
      "1,000.01",
    );
    assert.equal(formatNumber(1000.01, "###,###.##", { locale: fr }), 
      "1\u202f000,01",
    );
    assert.equal(formatNumber(1000.01, "###,###.##", { locale: de }), 
      "1.000,01",
    );
  });
});
