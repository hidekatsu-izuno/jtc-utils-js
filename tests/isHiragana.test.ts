import { describe, expect, test } from "vitest"
import { isHiragana } from "../src/isHiragana.js"

describe('isHiragana', () => {
  test("test empty", () => {
    expect(isHiragana(undefined)).toBe(false)
    expect(isHiragana(null)).toBe(false)
    expect(isHiragana("")).toBe(false)
  })

  test("test basic sequcence", () => {
    expect(isHiragana('あいうえお')).toBe(true)
    expect(isHiragana('あイうエお')).toBe(false)
    expect(isHiragana('アいウえオ')).toBe(false)
  })

  test("test ascii", () => {
    expect(isHiragana('\0')).toBe(false)
    expect(isHiragana('\t')).toBe(false)
    expect(isHiragana('\r')).toBe(false)
    expect(isHiragana('\n')).toBe(false)
    expect(isHiragana(' ')).toBe(false)
    expect(isHiragana('a')).toBe(false)
    expect(isHiragana('0')).toBe(false)
    expect(isHiragana('@')).toBe(false)
    expect(isHiragana('\x7F')).toBe(false)
  })

  test("test fullwidth symbol", () => {
    expect(isHiragana("　")).toBe(true)
    expect(isHiragana("゠")).toBe(false)
    expect(isHiragana("・")).toBe(false)
    expect(isHiragana("ー")).toBe(false)
    expect(isHiragana("「")).toBe(false)
    expect(isHiragana("」")).toBe(false)
    expect(isHiragana("、")).toBe(false)
    expect(isHiragana("。")).toBe(false)
    expect(isHiragana("￠")).toBe(false)
    expect(isHiragana("￦")).toBe(false)
    expect(isHiragana("｟")).toBe(false)
    expect(isHiragana("｠")).toBe(false)
  })

  test("test fullwidth hiragana", () => {
    expect(isHiragana("あ")).toBe(true)
    expect(isHiragana("ぁ")).toBe(true)
    expect(isHiragana("が")).toBe(true)
    expect(isHiragana("ぱ")).toBe(true)
    expect(isHiragana("ゐ")).toBe(true)
    expect(isHiragana("ゑ")).toBe(true)
    expect(isHiragana("ん")).toBe(true)
    expect(isHiragana("ゔ")).toBe(true)
    expect(isHiragana("ゕ")).toBe(true)
    expect(isHiragana("ゖ")).toBe(true)
  })

  test("test fullwidth katakana", () => {
    expect(isHiragana("ア")).toBe(false)
    expect(isHiragana("ァ")).toBe(false)
    expect(isHiragana("ガ")).toBe(false)
    expect(isHiragana("パ")).toBe(false)
    expect(isHiragana("ヰ")).toBe(false)
    expect(isHiragana("ヱ")).toBe(false)
    expect(isHiragana("ン")).toBe(false)
    expect(isHiragana("ヷ")).toBe(false)
    expect(isHiragana("ヸ")).toBe(false)
    expect(isHiragana("ヴ")).toBe(false)
    expect(isHiragana("ヺ")).toBe(false)
    expect(isHiragana("ヹ")).toBe(false)
    expect(isHiragana("ヵ")).toBe(false)
    expect(isHiragana("ヶ")).toBe(false)
  })

  test("test halfwidth symbol", () => {
    expect(isHiragana("｡")).toBe(false)
    expect(isHiragana("｢")).toBe(false)
    expect(isHiragana("｣")).toBe(false)
    expect(isHiragana("､")).toBe(false)
    expect(isHiragana("･")).toBe(false)
    expect(isHiragana("ｰ")).toBe(false)
    expect(isHiragana("ﾞ")).toBe(false)
    expect(isHiragana("ﾟ")).toBe(false)
    expect(isHiragana("¢")).toBe(false)
    expect(isHiragana("€")).toBe(false)
    expect(isHiragana("₩")).toBe(false)
  })

  test("test halfwidth katakana", () => {
    expect(isHiragana("ｱ")).toBe(false)
    expect(isHiragana("ｧ")).toBe(false)
    expect(isHiragana("ｶﾞ")).toBe(false)
    expect(isHiragana("ﾊﾟ")).toBe(false)
    expect(isHiragana("ｳﾞ")).toBe(false)
    expect(isHiragana("ﾝ")).toBe(false)
  })

  test("test fullwidth kanji", () => {
    expect(isHiragana("亜")).toBe(false)
    expect(isHiragana("腕")).toBe(false)
    expect(isHiragana("黑")).toBe(false)
    expect(isHiragana("𠮟")).toBe(false)
  })
})
