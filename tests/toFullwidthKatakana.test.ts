import { describe, expect, test } from "vitest";
import { toFullwidthKatakana } from "../src/toFullwidthKatakana.js";

describe("toFullwidthKatakana", () => {
  test("Convert to katakana", () => {
    expect(toFullwidthKatakana("\0")).toBe("\0");
    expect(toFullwidthKatakana("!")).toBe("!");
    expect(toFullwidthKatakana("0")).toBe("0");
    expect(toFullwidthKatakana("A")).toBe("A");
    expect(toFullwidthKatakana("a")).toBe("a");
    expect(toFullwidthKatakana("~")).toBe("~");
    expect(toFullwidthKatakana("亜")).toBe("亜");
    expect(toFullwidthKatakana("ｱ")).toBe("ア");
    expect(toFullwidthKatakana("ア")).toBe("ア");
    expect(toFullwidthKatakana("あ")).toBe("ア");
    expect(toFullwidthKatakana("ｶﾞ")).toBe("ガ");
    expect(toFullwidthKatakana("ガ")).toBe("ガ");
    expect(toFullwidthKatakana("が")).toBe("ガ");
    expect(toFullwidthKatakana("ﾊﾟ")).toBe("パ");
    expect(toFullwidthKatakana("パ")).toBe("パ");
    expect(toFullwidthKatakana("ぱ")).toBe("パ");
    expect(toFullwidthKatakana("｢")).toBe("「");
    expect(toFullwidthKatakana("ｰ")).toBe("ー");
  });

  test("test basic sequences", () => {
    expect(toFullwidthKatakana("あがさ・ｸﾘｽﾃｨｰ")).toBe("アガサ・クリスティー");
  });
});
