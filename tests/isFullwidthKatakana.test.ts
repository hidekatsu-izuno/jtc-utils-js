import { describe, expect, test } from "vitest"
import { isKatakana } from "../src/isKatakana.js"

describe('isKatakana', () => {
  test("test empty", () => {
    expect(isKatakana(undefined)).toBe(false)
    expect(isKatakana(null)).toBe(false)
    expect(isKatakana("")).toBe(false)
  })

  test("test basic sequcence", () => {
    expect(isKatakana('アイウエオ')).toBe(true)
    expect(isKatakana('あイうエお')).toBe(false)
    expect(isKatakana('アいウえオ')).toBe(false)
  })

  test("test ascii", () => {
    expect(isKatakana('\0')).toBe(false)
    expect(isKatakana('\t')).toBe(false)
    expect(isKatakana('\r')).toBe(false)
    expect(isKatakana('\n')).toBe(false)
    expect(isKatakana(' ')).toBe(false)
    expect(isKatakana('a')).toBe(false)
    expect(isKatakana('0')).toBe(false)
    expect(isKatakana('@')).toBe(false)
    expect(isKatakana('\x7F')).toBe(false)
  })

  test("test fullwidth symbol", () => {
    expect(isKatakana("　")).toBe(true)
    expect(isKatakana("゠")).toBe(false)
    expect(isKatakana("・")).toBe(false)
    expect(isKatakana("ー")).toBe(true)
    expect(isKatakana("「")).toBe(false)
    expect(isKatakana("」")).toBe(false)
    expect(isKatakana("、")).toBe(false)
    expect(isKatakana("。")).toBe(false)
    expect(isKatakana("￠")).toBe(false)
    expect(isKatakana("￦")).toBe(false)
    expect(isKatakana("｟")).toBe(false)
    expect(isKatakana("｠")).toBe(false)
  })

  test("test fullwidth hiragana", () => {
    expect(isKatakana("あ")).toBe(false)
    expect(isKatakana("ぁ")).toBe(false)
    expect(isKatakana("が")).toBe(false)
    expect(isKatakana("ぱ")).toBe(false)
    expect(isKatakana("ゐ")).toBe(false)
    expect(isKatakana("ゑ")).toBe(false)
    expect(isKatakana("ん")).toBe(false)
    expect(isKatakana("ゔ")).toBe(false)
    expect(isKatakana("ゕ")).toBe(false)
    expect(isKatakana("ゖ")).toBe(false)
  })

  test("test fullwidth katakana", () => {
    expect(isKatakana("ア")).toBe(true)
    expect(isKatakana("ァ")).toBe(true)
    expect(isKatakana("ガ")).toBe(true)
    expect(isKatakana("パ")).toBe(true)
    expect(isKatakana("ヰ")).toBe(true)
    expect(isKatakana("ヱ")).toBe(true)
    expect(isKatakana("ン")).toBe(true)
    expect(isKatakana("ヷ")).toBe(true)
    expect(isKatakana("ヸ")).toBe(true)
    expect(isKatakana("ヴ")).toBe(true)
    expect(isKatakana("ヺ")).toBe(true)
    expect(isKatakana("ヹ")).toBe(true)
    expect(isKatakana("ヵ")).toBe(true)
    expect(isKatakana("ヶ")).toBe(true)
  })

  test("test halfwidth symbol", () => {
    expect(isKatakana("｡")).toBe(false)
    expect(isKatakana("｢")).toBe(false)
    expect(isKatakana("｣")).toBe(false)
    expect(isKatakana("､")).toBe(false)
    expect(isKatakana("･")).toBe(false)
    expect(isKatakana("ｰ")).toBe(false)
    expect(isKatakana("ﾞ")).toBe(false)
    expect(isKatakana("ﾟ")).toBe(false)
    expect(isKatakana("¢")).toBe(false)
    expect(isKatakana("€")).toBe(false)
    expect(isKatakana("₩")).toBe(false)
  })

  test("test halfwidth katakana", () => {
    expect(isKatakana("ｱ")).toBe(false)
    expect(isKatakana("ｧ")).toBe(false)
    expect(isKatakana("ｶﾞ")).toBe(false)
    expect(isKatakana("ﾊﾟ")).toBe(false)
    expect(isKatakana("ｳﾞ")).toBe(false)
    expect(isKatakana("ﾝ")).toBe(false)
  })

  test("test fullwidth kanji", () => {
    expect(isKatakana("亜")).toBe(false)
    expect(isKatakana("腕")).toBe(false)
    expect(isKatakana("黑")).toBe(false)
    expect(isKatakana("𠮟")).toBe(false)
  })
})
