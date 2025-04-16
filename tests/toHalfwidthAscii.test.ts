import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { toHalfwidthAscii } from "../src/toHalfwidthAscii.ts";

suite("toHalfwidthAscii", () => {
  test("test converting to half width", () => {
    assert.equal(toHalfwidthAscii("\0"), "\0");
    assert.equal(toHalfwidthAscii("　"), " ");
    assert.equal(toHalfwidthAscii("！"), "!");
    assert.equal(toHalfwidthAscii("０"), "0");
    assert.equal(toHalfwidthAscii("Ａ"), "A");
    assert.equal(toHalfwidthAscii("ａ"), "a");
    assert.equal(toHalfwidthAscii("～"), "~");
    assert.equal(toHalfwidthAscii("亜"), "亜");
    assert.equal(toHalfwidthAscii("ア"), "ア");
    assert.equal(toHalfwidthAscii("ｱ"), "ｱ");
    assert.equal(toHalfwidthAscii("ガ"), "ガ");
    assert.equal(toHalfwidthAscii("ｶﾞ"), "ｶﾞ");
    assert.equal(toHalfwidthAscii("パ"), "パ");
    assert.equal(toHalfwidthAscii("ﾊﾟ"), "ﾊﾟ");
    assert.equal(toHalfwidthAscii("「"), "「");
    assert.equal(toHalfwidthAscii("」"), "」");
  });

  test("test basic sequences", () => {
    assert.equal(toHalfwidthAscii("０Ａアガパー"), "0Aアガパー");
  });
});
