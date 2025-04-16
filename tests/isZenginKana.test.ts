import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { isZenginKana } from "../src/isZenginKana.ts";

suite("isZenginKana", () => {
  test("test empty", () => {
    assert.equal(isZenginKana(undefined), false);
    assert.equal(isZenginKana(null), false);
    assert.equal(isZenginKana(""), false);
  });

  test("test basic sequcence", () => {
    assert.equal(isZenginKana("ｱｲｳｴｵｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ.-ABC"), true);
    assert.equal(isZenginKana("あｲｳｴｵｶﾞｷﾞｸﾞゲｺﾞﾊﾟﾋﾟﾌﾟﾍﾟぽ"), false);
    assert.equal(isZenginKana("ｱいｳエｵガｷﾞぐｹﾞゴﾊﾟぴﾌﾟプﾎﾟ"), false);
  });

  test("test ascii", () => {
    assert.equal(isZenginKana("\0"), false);
    assert.equal(isZenginKana("\t"), false);
    assert.equal(isZenginKana("\r"), false);
    assert.equal(isZenginKana("\n"), false);
    assert.equal(isZenginKana(" "), true);
    assert.equal(isZenginKana("A"), true);
    assert.equal(isZenginKana("Z"), true);
    assert.equal(isZenginKana("a"), false);
    assert.equal(isZenginKana("z"), false);
    assert.equal(isZenginKana("0"), true);
    assert.equal(isZenginKana("9"), true);
    assert.equal(isZenginKana("-"), true);
    assert.equal(isZenginKana(","), false);
    assert.equal(isZenginKana("."), true);
    assert.equal(isZenginKana("@"), false);
    assert.equal(isZenginKana("\\"), true);
    assert.equal(isZenginKana("("), true);
    assert.equal(isZenginKana(")"), true);
    assert.equal(isZenginKana("["), false);
    assert.equal(isZenginKana("]"), false);
    assert.equal(isZenginKana("{"), false);
    assert.equal(isZenginKana("}"), false);
    assert.equal(isZenginKana("\x7F"), false);
  });

  test("test fullwidth symbol", () => {
    assert.equal(isZenginKana("　"), false);
    assert.equal(isZenginKana("゠"), false);
    assert.equal(isZenginKana("・"), false);
    assert.equal(isZenginKana("ー"), false);
    assert.equal(isZenginKana("「"), false);
    assert.equal(isZenginKana("」"), false);
    assert.equal(isZenginKana("、"), false);
    assert.equal(isZenginKana("。"), false);
    assert.equal(isZenginKana("￠"), false);
    assert.equal(isZenginKana("￦"), false);
    assert.equal(isZenginKana("｟"), false);
    assert.equal(isZenginKana("｠"), false);
  });

  test("test fullwidth hiragana", () => {
    assert.equal(isZenginKana("あ"), false);
    assert.equal(isZenginKana("ぁ"), false);
    assert.equal(isZenginKana("が"), false);
    assert.equal(isZenginKana("ぱ"), false);
    assert.equal(isZenginKana("ゐ"), false);
    assert.equal(isZenginKana("ゑ"), false);
    assert.equal(isZenginKana("ん"), false);
    assert.equal(isZenginKana("ゔ"), false);
    assert.equal(isZenginKana("ゕ"), false);
    assert.equal(isZenginKana("ゖ"), false);
    assert.equal(isZenginKana("ゝ"), false);
    assert.equal(isZenginKana("ゞ"), false);
    assert.equal(isZenginKana("ゟ"), false);
  });

  test("test fullwidth katakana", () => {
    assert.equal(isZenginKana("ア"), false);
    assert.equal(isZenginKana("ァ"), false);
    assert.equal(isZenginKana("ガ"), false);
    assert.equal(isZenginKana("パ"), false);
    assert.equal(isZenginKana("ヰ"), false);
    assert.equal(isZenginKana("ヱ"), false);
    assert.equal(isZenginKana("ン"), false);
    assert.equal(isZenginKana("ヷ"), false);
    assert.equal(isZenginKana("ヸ"), false);
    assert.equal(isZenginKana("ヴ"), false);
    assert.equal(isZenginKana("ヺ"), false);
    assert.equal(isZenginKana("ヹ"), false);
    assert.equal(isZenginKana("ヵ"), false);
    assert.equal(isZenginKana("ヶ"), false);
    assert.equal(isZenginKana("ヽ"), false);
    assert.equal(isZenginKana("ヾ"), false);
    assert.equal(isZenginKana("ヿ"), false);
  });

  test("test halfwidth symbol", () => {
    assert.equal(isZenginKana("｡"), false);
    assert.equal(isZenginKana("｢"), true);
    assert.equal(isZenginKana("｣"), true);
    assert.equal(isZenginKana("､"), false);
    assert.equal(isZenginKana("･"), false);
    assert.equal(isZenginKana("ｰ"), false);
    assert.equal(isZenginKana("ﾞ"), true);
    assert.equal(isZenginKana("ﾟ"), true);
    assert.equal(isZenginKana("¢"), false);
    assert.equal(isZenginKana("€"), false);
    assert.equal(isZenginKana("₩"), false);
  });

  test("test halfwidth katakana", () => {
    assert.equal(isZenginKana("ｱ"), true);
    assert.equal(isZenginKana("ｧ"), false);
    assert.equal(isZenginKana("ｶﾞ"), true);
    assert.equal(isZenginKana("ﾊﾟ"), true);
    assert.equal(isZenginKana("ｳﾞ"), true);
    assert.equal(isZenginKana("ｦ"), false);
    assert.equal(isZenginKana("ﾝ"), true);
  });

  test("test fullwidth kanji", () => {
    assert.equal(isZenginKana("亜"), false);
    assert.equal(isZenginKana("腕"), false);
    assert.equal(isZenginKana("黑"), false);
    assert.equal(isZenginKana("𠮟"), false);
  });
});
