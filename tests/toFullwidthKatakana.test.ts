import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { toFullwidthKatakana } from "../src/toFullwidthKatakana.ts";

suite("toFullwidthKatakana", () => {
  test("Convert to katakana", () => {
    assert.equal(toFullwidthKatakana("\0"), "\0");
    assert.equal(toFullwidthKatakana("!"), "!");
    assert.equal(toFullwidthKatakana("0"), "0");
    assert.equal(toFullwidthKatakana("A"), "A");
    assert.equal(toFullwidthKatakana("a"), "a");
    assert.equal(toFullwidthKatakana("~"), "~");
    assert.equal(toFullwidthKatakana("亜"), "亜");
    assert.equal(toFullwidthKatakana("ｱ"), "ア");
    assert.equal(toFullwidthKatakana("ア"), "ア");
    assert.equal(toFullwidthKatakana("あ"), "ア");
    assert.equal(toFullwidthKatakana("ｶﾞ"), "ガ");
    assert.equal(toFullwidthKatakana("ガ"), "ガ");
    assert.equal(toFullwidthKatakana("が"), "ガ");
    assert.equal(toFullwidthKatakana("ﾊﾟ"), "パ");
    assert.equal(toFullwidthKatakana("パ"), "パ");
    assert.equal(toFullwidthKatakana("ぱ"), "パ");
    assert.equal(toFullwidthKatakana("｢"), "「");
    assert.equal(toFullwidthKatakana("ｰ"), "ー");
  });

  test("test basic sequences", () => {
    assert.equal(toFullwidthKatakana("あがさ・ｸﾘｽﾃｨｰ"), "アガサ・クリスティー");
  });
});
