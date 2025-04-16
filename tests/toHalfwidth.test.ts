import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { toHalfwidth } from "../src/toHalfwidth.ts";

suite("toHalfwidth", () => {
  test("test converting to half width", () => {
    assert.equal(toHalfwidth("\0"), "\0");
    assert.equal(toHalfwidth("　"), " ");
    assert.equal(toHalfwidth("！"), "!");
    assert.equal(toHalfwidth("０"), "0");
    assert.equal(toHalfwidth("Ａ"), "A");
    assert.equal(toHalfwidth("ａ"), "a");
    assert.equal(toHalfwidth("～"), "~");
    assert.equal(toHalfwidth("亜"), "亜");
    assert.equal(toHalfwidth("ア"), "ｱ");
    assert.equal(toHalfwidth("ｱ"), "ｱ");
    assert.equal(toHalfwidth("ガ"), "ｶﾞ");
    assert.equal(toHalfwidth("ｶﾞ"), "ｶﾞ");
    assert.equal(toHalfwidth("パ"), "ﾊﾟ");
    assert.equal(toHalfwidth("ﾊﾟ"), "ﾊﾟ");
    assert.equal(toHalfwidth("「"), "｢");
    assert.equal(toHalfwidth("」"), "｣");
  });

  test("test basic sequences", () => {
    assert.equal(toHalfwidth("０Ａアガパー"), "0Aｱｶﾞﾊﾟｰ");
  });
});
