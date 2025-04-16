import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { toHiragana } from "../src/toHiragana.ts";

suite("toHiragana", () => {
  test("Convert to hiragana", () => {
    assert.equal(toHiragana("\0"), "\0");
    assert.equal(toHiragana("!"), "!");
    assert.equal(toHiragana("0"), "0");
    assert.equal(toHiragana("A"), "A");
    assert.equal(toHiragana("a"), "a");
    assert.equal(toHiragana("~"), "~");
    assert.equal(toHiragana("亜"), "亜");
    assert.equal(toHiragana("ｱ"), "あ");
    assert.equal(toHiragana("ア"), "あ");
    assert.equal(toHiragana("あ"), "あ");
    assert.equal(toHiragana("ｶﾞ"), "が");
    assert.equal(toHiragana("ガ"), "が");
    assert.equal(toHiragana("が"), "が");
    assert.equal(toHiragana("ﾊﾟ"), "ぱ");
    assert.equal(toHiragana("パ"), "ぱ");
    assert.equal(toHiragana("ぱ"), "ぱ");
  });

  test("test basic sequences", () => {
    assert.equal(toHiragana("アガサ・ｸﾘｽﾃｨｰ"), "あがさ・くりすてぃー");
  });
});
