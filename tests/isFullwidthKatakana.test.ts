import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { isFullwidthKatakana } from "../src/isFullwidthKatakana.ts";

suite("isFullwidthKatakana", () => {
  test("test empty", () => {
    assert.equal(isFullwidthKatakana(undefined), false);
    assert.equal(isFullwidthKatakana(null), false);
    assert.equal(isFullwidthKatakana(""), false);
  });

  test("test basic sequcence", () => {
    assert.equal(isFullwidthKatakana("アイウエオ"), true);
    assert.equal(isFullwidthKatakana("あイうエお"), false);
    assert.equal(isFullwidthKatakana("アいウえオ"), false);
  });

  test("test ascii", () => {
    assert.equal(isFullwidthKatakana("\0"), false);
    assert.equal(isFullwidthKatakana("\t"), false);
    assert.equal(isFullwidthKatakana("\r"), false);
    assert.equal(isFullwidthKatakana("\n"), false);
    assert.equal(isFullwidthKatakana(" "), false);
    assert.equal(isFullwidthKatakana("a"), false);
    assert.equal(isFullwidthKatakana("0"), false);
    assert.equal(isFullwidthKatakana("@"), false);
    assert.equal(isFullwidthKatakana("\x7F"), false);
  });

  test("test fullwidth symbol", () => {
    assert.equal(isFullwidthKatakana("　"), true);
    assert.equal(isFullwidthKatakana("゠"), false);
    assert.equal(isFullwidthKatakana("・"), true);
    assert.equal(isFullwidthKatakana("ー"), true);
    assert.equal(isFullwidthKatakana("「"), false);
    assert.equal(isFullwidthKatakana("」"), false);
    assert.equal(isFullwidthKatakana("、"), false);
    assert.equal(isFullwidthKatakana("。"), false);
    assert.equal(isFullwidthKatakana("￠"), false);
    assert.equal(isFullwidthKatakana("￦"), false);
    assert.equal(isFullwidthKatakana("｟"), false);
    assert.equal(isFullwidthKatakana("｠"), false);
  });

  test("test fullwidth hiragana", () => {
    assert.equal(isFullwidthKatakana("あ"), false);
    assert.equal(isFullwidthKatakana("ぁ"), false);
    assert.equal(isFullwidthKatakana("が"), false);
    assert.equal(isFullwidthKatakana("ぱ"), false);
    assert.equal(isFullwidthKatakana("ゐ"), false);
    assert.equal(isFullwidthKatakana("ゑ"), false);
    assert.equal(isFullwidthKatakana("ん"), false);
    assert.equal(isFullwidthKatakana("ゔ"), false);
    assert.equal(isFullwidthKatakana("ゕ"), false);
    assert.equal(isFullwidthKatakana("ゖ"), false);
  });

  test("test fullwidth katakana", () => {
    assert.equal(isFullwidthKatakana("ア"), true);
    assert.equal(isFullwidthKatakana("ァ"), true);
    assert.equal(isFullwidthKatakana("ガ"), true);
    assert.equal(isFullwidthKatakana("パ"), true);
    assert.equal(isFullwidthKatakana("ヰ"), true);
    assert.equal(isFullwidthKatakana("ヱ"), true);
    assert.equal(isFullwidthKatakana("ン"), true);
    assert.equal(isFullwidthKatakana("ヷ"), true);
    assert.equal(isFullwidthKatakana("ヸ"), true);
    assert.equal(isFullwidthKatakana("ヴ"), true);
    assert.equal(isFullwidthKatakana("ヺ"), true);
    assert.equal(isFullwidthKatakana("ヹ"), true);
    assert.equal(isFullwidthKatakana("ヵ"), true);
    assert.equal(isFullwidthKatakana("ヶ"), true);
  });

  test("test halfwidth symbol", () => {
    assert.equal(isFullwidthKatakana("｡"), false);
    assert.equal(isFullwidthKatakana("｢"), false);
    assert.equal(isFullwidthKatakana("｣"), false);
    assert.equal(isFullwidthKatakana("､"), false);
    assert.equal(isFullwidthKatakana("･"), false);
    assert.equal(isFullwidthKatakana("ｰ"), false);
    assert.equal(isFullwidthKatakana("ﾞ"), false);
    assert.equal(isFullwidthKatakana("ﾟ"), false);
    assert.equal(isFullwidthKatakana("¢"), false);
    assert.equal(isFullwidthKatakana("€"), false);
    assert.equal(isFullwidthKatakana("₩"), false);
  });

  test("test halfwidth katakana", () => {
    assert.equal(isFullwidthKatakana("ｱ"), false);
    assert.equal(isFullwidthKatakana("ｧ"), false);
    assert.equal(isFullwidthKatakana("ｶﾞ"), false);
    assert.equal(isFullwidthKatakana("ﾊﾟ"), false);
    assert.equal(isFullwidthKatakana("ｳﾞ"), false);
    assert.equal(isFullwidthKatakana("ﾝ"), false);
  });

  test("test fullwidth kanji", () => {
    assert.equal(isFullwidthKatakana("亜"), false);
    assert.equal(isFullwidthKatakana("腕"), false);
    assert.equal(isFullwidthKatakana("黑"), false);
    assert.equal(isFullwidthKatakana("𠮟"), false);
  });
});
