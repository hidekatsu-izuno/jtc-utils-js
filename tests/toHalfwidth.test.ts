import { describe, expect, test } from 'vitest'
import { toHalfwidth } from '../src/toHalfwidth.js'

describe('toHalfwidth', () => {
  test("test converting to half width", () => {
    expect(toHalfwidth("\0")).toBe("\0")
    expect(toHalfwidth("！")).toBe("!")
    expect(toHalfwidth("０")).toBe("0")
    expect(toHalfwidth("Ａ")).toBe("A")
    expect(toHalfwidth("ａ")).toBe("a")
    expect(toHalfwidth("～")).toBe("~")
    expect(toHalfwidth("亜")).toBe("亜")
    expect(toHalfwidth("ア")).toBe("ｱ")
    expect(toHalfwidth("ｱ")).toBe("ｱ")
    expect(toHalfwidth("ガ")).toBe("ｶﾞ")
    expect(toHalfwidth("ｶﾞ")).toBe("ｶﾞ")
    expect(toHalfwidth("パ")).toBe("ﾊﾟ")
    expect(toHalfwidth("ﾊﾟ")).toBe("ﾊﾟ")
    expect(toHalfwidth("「")).toBe("｢")
    expect(toHalfwidth("」")).toBe("｣")
  })
})
