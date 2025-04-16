import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { toFullwidth } from "../src/toFullwidth.ts";

suite("toFullwidth", () => {
  test("test converting to full width", () => {
    assert.equal(toFullwidth("\0"), "\0");
    assert.equal(toFullwidth("!"), "！");
    assert.equal(toFullwidth("0"), "０");
    assert.equal(toFullwidth("A"), "Ａ");
    assert.equal(toFullwidth("a"), "ａ");
    assert.equal(toFullwidth("~"), "～");
    assert.equal(toFullwidth("亜"), "亜");
    assert.equal(toFullwidth("ｱ"), "ア");
    assert.equal(toFullwidth("ア"), "ア");
    assert.equal(toFullwidth("ｶﾞ"), "ガ");
    assert.equal(toFullwidth("ガ"), "ガ");
    assert.equal(toFullwidth("ﾊﾟ"), "パ");
    assert.equal(toFullwidth("パ"), "パ");
    assert.equal(toFullwidth("｢"), "「");
    assert.equal(toFullwidth("ｰ"), "ー");
  });

  test("test basic sequences", () => {
    assert.equal(toFullwidth("0Aｱｶﾞﾊﾟｰ"), "０Ａアガパー");
  });
});
