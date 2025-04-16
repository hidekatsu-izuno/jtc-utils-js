import assert from "node:assert/strict";
import { describe, expect, test } from "vitest";
import { isHiragana } from "../src/isHiragana.js";

describe("isHiragana", () => {
  test("test empty", () => {
    assert.equal(isHiragana(undefined), false);
    assert.equal(isHiragana(null), false);
    assert.equal(isHiragana(""), false);
  });

  test("test basic sequcence", () => {
    assert.equal(isHiragana("あいうえお"), true);
    assert.equal(isHiragana("あイうエお"), false);
    assert.equal(isHiragana("アいウえオ"), false);
  });

  test("test ascii", () => {
    assert.equal(isHiragana("\0"), false);
    assert.equal(isHiragana("\t"), false);
    assert.equal(isHiragana("\r"), false);
    assert.equal(isHiragana("\n"), false);
    assert.equal(isHiragana(" "), false);
    assert.equal(isHiragana("a"), false);
    assert.equal(isHiragana("0"), false);
    assert.equal(isHiragana("@"), false);
    assert.equal(isHiragana("\x7F"), false);
  });

  test("test fullwidth symbol", () => {
    assert.equal(isHiragana("　"), true);
    assert.equal(isHiragana("゠"), false);
    assert.equal(isHiragana("・"), false);
    assert.equal(isHiragana("ー"), false);
    assert.equal(isHiragana("「"), false);
    assert.equal(isHiragana("」"), false);
    assert.equal(isHiragana("、"), false);
    assert.equal(isHiragana("。"), false);
    assert.equal(isHiragana("￠"), false);
    assert.equal(isHiragana("￦"), false);
    assert.equal(isHiragana("｟"), false);
    assert.equal(isHiragana("｠"), false);
  });

  test("test fullwidth hiragana", () => {
    assert.equal(isHiragana("あ"), true);
    assert.equal(isHiragana("ぁ"), true);
    assert.equal(isHiragana("が"), true);
    assert.equal(isHiragana("ぱ"), true);
    assert.equal(isHiragana("ゐ"), true);
    assert.equal(isHiragana("ゑ"), true);
    assert.equal(isHiragana("ん"), true);
    assert.equal(isHiragana("ゔ"), true);
    assert.equal(isHiragana("ゕ"), true);
    assert.equal(isHiragana("ゖ"), true);
  });

  test("test fullwidth katakana", () => {
    assert.equal(isHiragana("ア"), false);
    assert.equal(isHiragana("ァ"), false);
    assert.equal(isHiragana("ガ"), false);
    assert.equal(isHiragana("パ"), false);
    assert.equal(isHiragana("ヰ"), false);
    assert.equal(isHiragana("ヱ"), false);
    assert.equal(isHiragana("ン"), false);
    assert.equal(isHiragana("ヷ"), false);
    assert.equal(isHiragana("ヸ"), false);
    assert.equal(isHiragana("ヴ"), false);
    assert.equal(isHiragana("ヺ"), false);
    assert.equal(isHiragana("ヹ"), false);
    assert.equal(isHiragana("ヵ"), false);
    assert.equal(isHiragana("ヶ"), false);
  });

  test("test halfwidth symbol", () => {
    assert.equal(isHiragana("｡"), false);
    assert.equal(isHiragana("｢"), false);
    assert.equal(isHiragana("｣"), false);
    assert.equal(isHiragana("､"), false);
    assert.equal(isHiragana("･"), false);
    assert.equal(isHiragana("ｰ"), false);
    assert.equal(isHiragana("ﾞ"), false);
    assert.equal(isHiragana("ﾟ"), false);
    assert.equal(isHiragana("¢"), false);
    assert.equal(isHiragana("€"), false);
    assert.equal(isHiragana("₩"), false);
  });

  test("test halfwidth katakana", () => {
    assert.equal(isHiragana("ｱ"), false);
    assert.equal(isHiragana("ｧ"), false);
    assert.equal(isHiragana("ｶﾞ"), false);
    assert.equal(isHiragana("ﾊﾟ"), false);
    assert.equal(isHiragana("ｳﾞ"), false);
    assert.equal(isHiragana("ﾝ"), false);
  });

  test("test fullwidth kanji", () => {
    assert.equal(isHiragana("亜"), false);
    assert.equal(isHiragana("腕"), false);
    assert.equal(isHiragana("黑"), false);
    assert.equal(isHiragana("𠮟"), false);
  });
});
