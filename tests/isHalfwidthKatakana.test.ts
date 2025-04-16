import assert from "node:assert/strict";
import { describe, expect, test } from "vitest";
import { isHalfwidthKatakana } from "../src/isHalfwidthKatakana.js";

describe("isHalfwidthKatakana", () => {
  test("test empty", () => {
    assert.equal(isHalfwidthKatakana(undefined), false);
    assert.equal(isHalfwidthKatakana(null), false);
    assert.equal(isHalfwidthKatakana(""), false);
  });

  test("test basic sequcence", () => {
    assert.equal(isHalfwidthKatakana("ｱｲｳｴｵｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ･ｰ"), true);
    assert.equal(isHalfwidthKatakana("あｲｳｴｵｶﾞｷﾞｸﾞゲｺﾞﾊﾟﾋﾟﾌﾟﾍﾟぽ"), false);
    assert.equal(isHalfwidthKatakana("ｱいｳエｵガｷﾞぐｹﾞゴﾊﾟぴﾌﾟプﾎﾟ"), false);
  });

  test("test ascii", () => {
    assert.equal(isHalfwidthKatakana("\0"), false);
    assert.equal(isHalfwidthKatakana("\t"), false);
    assert.equal(isHalfwidthKatakana("\r"), false);
    assert.equal(isHalfwidthKatakana("\n"), false);
    assert.equal(isHalfwidthKatakana(" "), true);
    assert.equal(isHalfwidthKatakana("a"), false);
    assert.equal(isHalfwidthKatakana("0"), false);
    assert.equal(isHalfwidthKatakana("@"), false);
    assert.equal(isHalfwidthKatakana("\x7F"), false);
  });

  test("test fullwidth symbol", () => {
    assert.equal(isHalfwidthKatakana("　"), false);
    assert.equal(isHalfwidthKatakana("゠"), false);
    assert.equal(isHalfwidthKatakana("・"), false);
    assert.equal(isHalfwidthKatakana("ー"), false);
    assert.equal(isHalfwidthKatakana("「"), false);
    assert.equal(isHalfwidthKatakana("」"), false);
    assert.equal(isHalfwidthKatakana("、"), false);
    assert.equal(isHalfwidthKatakana("。"), false);
    assert.equal(isHalfwidthKatakana("￠"), false);
    assert.equal(isHalfwidthKatakana("￦"), false);
    assert.equal(isHalfwidthKatakana("｟"), false);
    assert.equal(isHalfwidthKatakana("｠"), false);
  });

  test("test fullwidth hiragana", () => {
    assert.equal(isHalfwidthKatakana("あ"), false);
    assert.equal(isHalfwidthKatakana("ぁ"), false);
    assert.equal(isHalfwidthKatakana("が"), false);
    assert.equal(isHalfwidthKatakana("ぱ"), false);
    assert.equal(isHalfwidthKatakana("ゐ"), false);
    assert.equal(isHalfwidthKatakana("ゑ"), false);
    assert.equal(isHalfwidthKatakana("ん"), false);
    assert.equal(isHalfwidthKatakana("ゔ"), false);
    assert.equal(isHalfwidthKatakana("ゕ"), false);
    assert.equal(isHalfwidthKatakana("ゖ"), false);
  });

  test("test fullwidth katakana", () => {
    assert.equal(isHalfwidthKatakana("ア"), false);
    assert.equal(isHalfwidthKatakana("ァ"), false);
    assert.equal(isHalfwidthKatakana("ガ"), false);
    assert.equal(isHalfwidthKatakana("パ"), false);
    assert.equal(isHalfwidthKatakana("ヰ"), false);
    assert.equal(isHalfwidthKatakana("ヱ"), false);
    assert.equal(isHalfwidthKatakana("ン"), false);
    assert.equal(isHalfwidthKatakana("ヷ"), false);
    assert.equal(isHalfwidthKatakana("ヸ"), false);
    assert.equal(isHalfwidthKatakana("ヴ"), false);
    assert.equal(isHalfwidthKatakana("ヺ"), false);
    assert.equal(isHalfwidthKatakana("ヹ"), false);
    assert.equal(isHalfwidthKatakana("ヵ"), false);
    assert.equal(isHalfwidthKatakana("ヶ"), false);
  });

  test("test halfwidth symbol", () => {
    assert.equal(isHalfwidthKatakana("｡"), false);
    assert.equal(isHalfwidthKatakana("｢"), false);
    assert.equal(isHalfwidthKatakana("｣"), false);
    assert.equal(isHalfwidthKatakana("､"), false);
    assert.equal(isHalfwidthKatakana("･"), true);
    assert.equal(isHalfwidthKatakana("ｰ"), true);
    assert.equal(isHalfwidthKatakana("ﾞ"), true);
    assert.equal(isHalfwidthKatakana("ﾟ"), true);
    assert.equal(isHalfwidthKatakana("¢"), false);
    assert.equal(isHalfwidthKatakana("€"), false);
    assert.equal(isHalfwidthKatakana("₩"), false);
  });

  test("test halfwidth katakana", () => {
    assert.equal(isHalfwidthKatakana("ｱ"), true);
    assert.equal(isHalfwidthKatakana("ｧ"), true);
    assert.equal(isHalfwidthKatakana("ｶﾞ"), true);
    assert.equal(isHalfwidthKatakana("ﾊﾟ"), true);
    assert.equal(isHalfwidthKatakana("ｳﾞ"), true);
    assert.equal(isHalfwidthKatakana("ﾝ"), true);
  });

  test("test fullwidth kanji", () => {
    assert.equal(isHalfwidthKatakana("亜"), false);
    assert.equal(isHalfwidthKatakana("腕"), false);
    assert.equal(isHalfwidthKatakana("黑"), false);
    assert.equal(isHalfwidthKatakana("𠮟"), false);
  });
});
