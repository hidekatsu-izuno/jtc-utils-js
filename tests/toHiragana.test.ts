import { describe, expect, test } from "vitest"
import { toHiragana } from "../src/toHiragana.js"

describe('toHiragana', () => {
  test("Convert to hiragana", () => {
    expect(toHiragana("\0")).toBe("\0")
    expect(toHiragana("!")).toBe("!")
    expect(toHiragana("0")).toBe("0")
    expect(toHiragana("A")).toBe("A")
    expect(toHiragana("a")).toBe("a")
    expect(toHiragana("~")).toBe("~")
    expect(toHiragana("亜")).toBe("亜")
    expect(toHiragana("ｱ")).toBe("あ")
    expect(toHiragana("ア")).toBe("あ")
    expect(toHiragana("あ")).toBe("あ")
    expect(toHiragana("ｶﾞ")).toBe("が")
    expect(toHiragana("ガ")).toBe("が")
    expect(toHiragana("が")).toBe("が")
    expect(toHiragana("ﾊﾟ")).toBe("ぱ")
    expect(toHiragana("パ")).toBe("ぱ")
    expect(toHiragana("ぱ")).toBe("ぱ")
  })

  test("test basic sequences", () => {
    expect(toHiragana("アガサ・ｸﾘｽﾃｨｰ")).toBe("あがさ・くりすてぃー")
  })
})
