import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { toNormalizedString } from "../src/toNormalizedString.ts";

suite("toNormalizedString", () => {
  test("test safe unicode", () => {
    assert.equal(toNormalizedString("\0"), "\0");
    assert.equal(toNormalizedString("\t"), "\t");
    assert.equal(toNormalizedString("\r"), "\n");
    assert.equal(toNormalizedString("\n"), "\n");
    assert.equal(toNormalizedString("\r\n"), "\n");
    assert.equal(toNormalizedString(" "), " ");
    assert.equal(toNormalizedString("A"), "A");
    assert.equal(toNormalizedString("a"), "a");
    assert.equal(toNormalizedString("0"), "0");
    assert.equal(toNormalizedString("."), ".");
    assert.equal(toNormalizedString("@"), "@");
    assert.equal(toNormalizedString("\x7F"), "\x7F");
    assert.equal(toNormalizedString("あ"), "あ");
    assert.equal(toNormalizedString("ぁ"), "ぁ");
    assert.equal(toNormalizedString("\u3046\u3099"), "ゔ");
    assert.equal(toNormalizedString("\u304B\u3099"), "が");
    assert.equal(toNormalizedString("\u306F\u309A"), "ぱ");
    assert.equal(toNormalizedString("ア"), "ア");
    assert.equal(toNormalizedString("ァ"), "ァ");
    assert.equal(toNormalizedString("\u30A6\u3099"), "ヴ");
    assert.equal(toNormalizedString("\u30AB\u3099"), "ガ");
    assert.equal(toNormalizedString("\u30CF\u309A"), "パ");
    assert.equal(toNormalizedString("\u30F2\u3099"), "ヺ");
    assert.equal(toNormalizedString("ｱ"), "ｱ");
    assert.equal(toNormalizedString("ｧ"), "ｧ");
    assert.equal(toNormalizedString("亜"), "亜");
    assert.equal(toNormalizedString("欄"), "欄");
    assert.equal(toNormalizedString("﨏"), "﨏");
    assert.equal(toNormalizedString("\uD800"), "\uD800");
    assert.equal(toNormalizedString("\uDC00"), "\uDC00");
    assert.equal(toNormalizedString("\uD800\uDC00"), "\uD800\uDC00");
    assert.equal(toNormalizedString("\uFDD0"), "\uFDD0");
    assert.equal(toNormalizedString("\uFDEF"), "\uFDEF");
    assert.equal(toNormalizedString("\uFEF0"), "\uFEF0");
    assert.equal(toNormalizedString("\uFEFF"), "\uFEFF");
    assert.equal(toNormalizedString("\uFFF0"), "\uFFF0");
    assert.equal(toNormalizedString("\uFFFE"), "\uFFFE");
    assert.equal(toNormalizedString("\uFFFF"), "\uFFFF");
    assert.equal(toNormalizedString("\u{1FFFE}"), "\u{1FFFE}");
    assert.equal(toNormalizedString("\u{1FFFF}"), "\u{1FFFF}");
    assert.equal(toNormalizedString("\u{10FFFE}"), "\u{10FFFE}");
    assert.equal(toNormalizedString("\u{10FFFF}"), "\u{10FFFF}");
  });

  test("test basic sequences", () => {
    assert.equal(
      toNormalizedString("Aあｱ亜欄\u304B\u3099\r\n"),
      "Aあｱ亜欄\u304C\n",
    );
  });
});
