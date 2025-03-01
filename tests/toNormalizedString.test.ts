import { describe, expect, test } from "vitest";
import { toNormalizedString } from "../src/toNormalizedString.js";

describe("toNormalizedString", () => {
  test("test safe unicode", () => {
    expect(toNormalizedString("\0")).toBe("\0");
    expect(toNormalizedString("\t")).toBe("\t");
    expect(toNormalizedString("\r")).toBe("\n");
    expect(toNormalizedString("\n")).toBe("\n");
    expect(toNormalizedString("\r\n")).toBe("\n");
    expect(toNormalizedString(" ")).toBe(" ");
    expect(toNormalizedString("A")).toBe("A");
    expect(toNormalizedString("a")).toBe("a");
    expect(toNormalizedString("0")).toBe("0");
    expect(toNormalizedString(".")).toBe(".");
    expect(toNormalizedString("@")).toBe("@");
    expect(toNormalizedString("\x7F")).toBe("\x7F");
    expect(toNormalizedString("あ")).toBe("あ");
    expect(toNormalizedString("ぁ")).toBe("ぁ");
    expect(toNormalizedString("\u3046\u3099")).toBe("ゔ");
    expect(toNormalizedString("\u304B\u3099")).toBe("が");
    expect(toNormalizedString("\u306F\u309A")).toBe("ぱ");
    expect(toNormalizedString("ア")).toBe("ア");
    expect(toNormalizedString("ァ")).toBe("ァ");
    expect(toNormalizedString("\u30A6\u3099")).toBe("ヴ");
    expect(toNormalizedString("\u30AB\u3099")).toBe("ガ");
    expect(toNormalizedString("\u30CF\u309A")).toBe("パ");
    expect(toNormalizedString("\u30F2\u3099")).toBe("ヺ");
    expect(toNormalizedString("ｱ")).toBe("ｱ");
    expect(toNormalizedString("ｧ")).toBe("ｧ");
    expect(toNormalizedString("亜")).toBe("亜");
    expect(toNormalizedString("欄")).toBe("欄");
    expect(toNormalizedString("﨏")).toBe("﨏");
    expect(toNormalizedString("\uD800")).toBe("\uD800");
    expect(toNormalizedString("\uDC00")).toBe("\uDC00");
    expect(toNormalizedString("\uD800\uDC00")).toBe("\uD800\uDC00");
    expect(toNormalizedString("\uFDD0")).toBe("\uFDD0");
    expect(toNormalizedString("\uFDEF")).toBe("\uFDEF");
    expect(toNormalizedString("\uFEF0")).toBe("\uFEF0");
    expect(toNormalizedString("\uFEFF")).toBe("\uFEFF");
    expect(toNormalizedString("\uFFF0")).toBe("\uFFF0");
    expect(toNormalizedString("\uFFFE")).toBe("\uFFFE");
    expect(toNormalizedString("\uFFFF")).toBe("\uFFFF");
    expect(toNormalizedString("\u{1FFFE}")).toBe("\u{1FFFE}");
    expect(toNormalizedString("\u{1FFFF}")).toBe("\u{1FFFF}");
    expect(toNormalizedString("\u{10FFFE}")).toBe("\u{10FFFE}");
    expect(toNormalizedString("\u{10FFFF}")).toBe("\u{10FFFF}");
  });

  test("test basic sequences", () => {
    expect(toNormalizedString("Aあｱ亜欄\u304B\u3099\r\n")).toBe(
      "Aあｱ亜欄\u304C\n",
    );
  });
});
