import { describe, expect, test } from 'vitest'
import { toFullwidth } from '../src/toFullwidth.js'

describe('toFullwidth', () => {
  test("test converting to full width", () => {
    expect(toFullwidth("\0")).toBe("\0")
    expect(toFullwidth("!")).toBe("！")
    expect(toFullwidth("0")).toBe("０")
    expect(toFullwidth("A")).toBe("Ａ")
    expect(toFullwidth("a")).toBe("ａ")
    expect(toFullwidth("~")).toBe("～")
    expect(toFullwidth("亜")).toBe("亜")
    expect(toFullwidth("ｱ")).toBe("ア")
    expect(toFullwidth("ア")).toBe("ア")
    expect(toFullwidth("ｶﾞ")).toBe("ガ")
    expect(toFullwidth("ガ")).toBe("ガ")
    expect(toFullwidth("ﾊﾟ")).toBe("パ")
    expect(toFullwidth("パ")).toBe("パ")
  })
})
