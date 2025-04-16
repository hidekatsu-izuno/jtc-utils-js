import assert from "node:assert/strict";
import { describe, expect, test } from "vitest";
import { toZenginKana } from "../src/toZenginKana.js";

describe("toZenginKana", () => {
  test("test characters", () => {
    assert.equal(toZenginKana("\0"), "\0");
    assert.equal(toZenginKana("¥"), "\\");
    assert.equal(toZenginKana(","), ".");
    assert.equal(toZenginKana("，"), ".");
    assert.equal(toZenginKana("．"), ".");
    assert.equal(toZenginKana("、"), ".");
    assert.equal(toZenginKana("。"), ".");
    assert.equal(toZenginKana("・"), ".");
    assert.equal(toZenginKana("ー"), "-");
    assert.equal(toZenginKana("－"), "-");
    assert.equal(toZenginKana("／"), "/");
    assert.equal(toZenginKana("＼"), "\\");
    assert.equal(toZenginKana("￥"), "\\");
    assert.equal(toZenginKana("("), "(");
    assert.equal(toZenginKana(")"), ")");
    assert.equal(toZenginKana("["), "(");
    assert.equal(toZenginKana("]"), ")");
    assert.equal(toZenginKana("（"), "(");
    assert.equal(toZenginKana("）"), ")");
    assert.equal(toZenginKana("［"), "(");
    assert.equal(toZenginKana("］"), ")");
    assert.equal(toZenginKana("｛"), "(");
    assert.equal(toZenginKana("｝"), ")");
    assert.equal(toZenginKana("！"), "！");
    assert.equal(toZenginKana("０"), "0");
    assert.equal(toZenginKana("Ａ"), "A");
    assert.equal(toZenginKana("ａ"), "A");
    assert.equal(toZenginKana("～"), "～");
    assert.equal(toZenginKana("亜"), "亜");
    assert.equal(toZenginKana("あ"), "ｱ");
    assert.equal(toZenginKana("ア"), "ｱ");
    assert.equal(toZenginKana("ｱ"), "ｱ");
    assert.equal(toZenginKana("が"), "ｶﾞ");
    assert.equal(toZenginKana("ガ"), "ｶﾞ");
    assert.equal(toZenginKana("ｶﾞ"), "ｶﾞ");
    assert.equal(toZenginKana("ぱ"), "ﾊﾟ");
    assert.equal(toZenginKana("パ"), "ﾊﾟ");
    assert.equal(toZenginKana("ﾊﾟ"), "ﾊﾟ");
    assert.equal(toZenginKana("「"), "｢");
    assert.equal(toZenginKana("」"), "｣");
  });

  test("test sequences", () => {
    assert.equal(toZenginKana("タグチ　トモロヲ"), "ﾀｸﾞﾁ ﾄﾓﾛｵ");
    assert.equal(toZenginKana("カ）ベローチェ"), "ｶ)ﾍﾞﾛ-ﾁｴ");
    assert.equal(toZenginKana("アガサ・クリスティー"), "ｱｶﾞｻ.ｸﾘｽﾃｲ-");
  });
});
