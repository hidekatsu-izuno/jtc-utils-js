import assert from "node:assert/strict";
import { suite, test } from "node:test";

import { formatNumber } from "../src/formatNumber.ts";
import { de, enUS, fr } from "../src/locale/index.ts";
import { parseNumber } from "../src/parseNumber.ts";

suite("parseNumber", () => {
  test("normalize fullwidth digits and punctuation before filtering", () => {
    assert.equal(parseNumber("１２３"), 123);
    assert.equal(parseNumber("1２3"), 123);
    assert.equal(parseNumber("－１，２３４．５円"), -1234.5);
  });

  test("parse positive and negative numbers with affixes", () => {
    for (const format of [
      "¥#,##0.00",
      "¥#,##0.00;¥-#,##0.00",
      "#,##0.00円;(#,##0.00円)",
    ]) {
      for (const value of [1234.5, -1234.5, 0]) {
        const options = { locale: enUS };
        assert.equal(
          parseNumber(formatNumber(value, format, options), format, options),
          value,
        );
      }
    }
  });

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
    assert.equal(
      parseNumber("(1,000.01)", "###,###.##;(###,###.##)"),
      -1000.01,
    );
  });

  test("test localized format from number to string", () => {
    assert.equal(
      parseNumber("1,000.01", "###,###.##", { locale: enUS }),
      1000.01,
    );
    assert.equal(
      parseNumber("1\u202f000,01", "###,###.##", { locale: fr }),
      1000.01,
    );
    assert.equal(
      parseNumber("1.000,01", "###,###.##", { locale: de }),
      1000.01,
    );
  });
});
