import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { isWindows31j } from "../src/isWindows31j.ts";

suite("isWindows31j", () => {
  test("test no string", () => {
    assert.equal(isWindows31j(undefined), false);
    assert.equal(isWindows31j(null), false);
    assert.equal(isWindows31j(""), false);
  });

  test("test basic sequcence", () => {
    assert.equal(isWindows31j("ｱｲｳｴｵｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ"), true);
    assert.equal(isWindows31j("あｲｳｴｵｶﾞｷﾞｸﾞゲｺﾞﾊﾟﾋﾟﾌﾟﾍﾟぽ"), true);
    assert.equal(isWindows31j("ｱいｳエｵガｷﾞぐｹﾞゴﾊﾟぴﾌﾟプﾎﾟ"), true);
    assert.equal(isWindows31j("亜いｳエｵガｷﾞ具ｹﾞゴﾊﾟぴプﾎﾟ"), true);
  });

  test("test ascii", () => {
    assert.equal(isWindows31j("\0"), true);
    assert.equal(isWindows31j("\t"), true);
    assert.equal(isWindows31j("\r"), true);
    assert.equal(isWindows31j("\n"), true);
    assert.equal(isWindows31j(" "), true);
    assert.equal(isWindows31j("a"), true);
    assert.equal(isWindows31j("0"), true);
    assert.equal(isWindows31j("@"), true);
    assert.equal(isWindows31j("\x7F"), true);
  });

  test("test fullwidth hiragana", () => {
    assert.equal(isWindows31j("あ"), true);
    assert.equal(isWindows31j("ぁ"), true);
    assert.equal(isWindows31j("が"), true);
    assert.equal(isWindows31j("ぱ"), true);
  });

  test("test fullwidth katakana", () => {
    assert.equal(isWindows31j("ア"), true);
    assert.equal(isWindows31j("ァ"), true);
    assert.equal(isWindows31j("ガ"), true);
    assert.equal(isWindows31j("パ"), true);
    assert.equal(isWindows31j("ヴ"), true);
  });

  test("test halfwidth katakana", () => {
    assert.equal(isWindows31j("ｱ"), true);
    assert.equal(isWindows31j("ｧ"), true);
    assert.equal(isWindows31j("ｶﾞ"), true);
    assert.equal(isWindows31j("ﾊﾟ"), true);
    assert.equal(isWindows31j("ｳﾞ"), true);
  });

  test("test halfwidth symbol", () => {
    assert.equal(isWindows31j("€"), false);
    assert.equal(isWindows31j("₩"), false);
  });

  test("test fullwidth symbol", () => {
    assert.equal(isWindows31j("　"), true);
    assert.equal(isWindows31j("、"), true);
    assert.equal(isWindows31j("￦"), false);
  });

  test("test fullwidth kanji", () => {
    assert.equal(isWindows31j("亜"), true);
    assert.equal(isWindows31j("腕"), true);
    assert.equal(isWindows31j("黑"), true);
    assert.equal(isWindows31j("𠮟"), false);
  });
});
