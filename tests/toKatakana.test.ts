import { describe, expect, test } from 'vitest'
import { toKatakana } from '../src/toKatakana.js'

describe('toKatakana', () => {
  test("Convert to katakana", () => {
    expect(toKatakana("\0")).toBe("\0")
    expect(toKatakana("!")).toBe("!")
    expect(toKatakana("0")).toBe("0")
    expect(toKatakana("A")).toBe("A")
    expect(toKatakana("a")).toBe("a")
    expect(toKatakana("~")).toBe("~")
    expect(toKatakana("亜")).toBe("亜")
    expect(toKatakana("ｱ")).toBe("ｱ")
    expect(toKatakana("ア")).toBe("ア")
    expect(toKatakana("あ")).toBe("ア")
    expect(toKatakana("ｶﾞ")).toBe("ｶﾞ")
    expect(toKatakana("ガ")).toBe("ガ")
    expect(toKatakana("が")).toBe("ガ")
    expect(toKatakana("ﾊﾟ")).toBe("ﾊﾟ")
    expect(toKatakana("パ")).toBe("パ")
    expect(toKatakana("ぱ")).toBe("パ")
  })
})
