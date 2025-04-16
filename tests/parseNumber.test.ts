import assert from "node:assert/strict";
import { describe, expect, test } from "vitest";
import { de, enUS, fr } from "../src/locale/index.js";
import { parseNumber } from "../src/parseNumber.js";

describe("parseNumber", () => {
  test("test parsing no formats", () => {
    assert.equal(parseNumber("1,000.01"), 1000.01);
    assert.equal(parseNumber("01,000.01"), 1000.01);
  });

  test("test parse from string", () => {
    assert.equal(parseNumber("0", "######"), 0);
    assert.equal(parseNumber("0", "###,###"), 0);
    assert.equal(parseNumber("0", "###,###.#"), 0);
    assert.equal(parseNumber("0.0", "###,###.#"), 0);
    assert.equal(parseNumber("0.01", "###,###.#"), 0.01);
    assert.equal(parseNumber("0", "###,###.0"), 0);
    assert.equal(parseNumber("0.0", "###,###.0"), 0);
    assert.equal(parseNumber("0.01", "###,###.0"), 0.01);

    assert.equal(parseNumber("10000", "######"), 10000);
    assert.equal(parseNumber("10,000", "###,###"), 10000);
    assert.equal(parseNumber("10,000", "###,###.#"), 10000);
    assert.equal(parseNumber("10,000.0", "###,###.0"), 10000);

    assert.equal(parseNumber("-10000", "######"), -10000);
    assert.equal(parseNumber("-10,000", "###,###"), -10000);
    assert.equal(parseNumber("-10,000", "###,###.#"), -10000);
    assert.equal(parseNumber("-10,000.0", "###,###.0"), -10000);
  });

  test("test parsing special formats", () => {
    assert.equal(parseNumber("(1,000.01)", "###,###.##;(###,###.##)"), -1000.01);
  });

  test("test localized format from number to string", () => {
    assert.equal(parseNumber("1,000.01", "###,###.##", { locale: enUS }), 
      1000.01,
    );
    assert.equal(parseNumber("1\u202f000,01", "###,###.##", { locale: fr }), 
      1000.01,
    );
    assert.equal(parseNumber("1.000,01", "###,###.##", { locale: de }), 1000.01);
  });
});
