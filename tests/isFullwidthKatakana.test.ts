import { describe, expect, test } from 'vitest'
import { isFullwidthKatakana } from '../src/isFullwidthKatakana.js'

describe('isFullwidthKatakana', () => {
  test("test no string", () => {
    expect(isFullwidthKatakana(undefined)).toBe(false)
    expect(isFullwidthKatakana(null)).toBe(false)
    expect(isFullwidthKatakana("")).toBe(false)
  })

  test("test basic sequcence", () => {
    expect(isFullwidthKatakana('アイウエオ')).toBe(true)
    expect(isFullwidthKatakana('あイうエお')).toBe(false)
    expect(isFullwidthKatakana('アいウえオ')).toBe(false)
  })

  test("test ascii", () => {
    expect(isFullwidthKatakana('\0')).toBe(false)
    expect(isFullwidthKatakana('\t')).toBe(false)
    expect(isFullwidthKatakana('\r')).toBe(false)
    expect(isFullwidthKatakana('\n')).toBe(false)
    expect(isFullwidthKatakana(' ')).toBe(false)
    expect(isFullwidthKatakana('a')).toBe(false)
    expect(isFullwidthKatakana('0')).toBe(false)
    expect(isFullwidthKatakana('@')).toBe(false)
    expect(isFullwidthKatakana('\x7F')).toBe(false)
  })

  test("test fullwidth symbol", () => {
    expect(isFullwidthKatakana("　")).toBe(true)
    expect(isFullwidthKatakana("゠")).toBe(false)
    expect(isFullwidthKatakana("・")).toBe(false)
    expect(isFullwidthKatakana("ー")).toBe(true)
    expect(isFullwidthKatakana("「")).toBe(false)
    expect(isFullwidthKatakana("」")).toBe(false)
    expect(isFullwidthKatakana("、")).toBe(false)
    expect(isFullwidthKatakana("。")).toBe(false)
    expect(isFullwidthKatakana("￠")).toBe(false)
    expect(isFullwidthKatakana("￦")).toBe(false)
    expect(isFullwidthKatakana("｟")).toBe(false)
    expect(isFullwidthKatakana("｠")).toBe(false)
  })

  test("test fullwidth hiragana", () => {
    expect(isFullwidthKatakana("あ")).toBe(false)
    expect(isFullwidthKatakana("ぁ")).toBe(false)
    expect(isFullwidthKatakana("が")).toBe(false)
    expect(isFullwidthKatakana("ぱ")).toBe(false)
    expect(isFullwidthKatakana("ゐ")).toBe(false)
    expect(isFullwidthKatakana("ゑ")).toBe(false)
    expect(isFullwidthKatakana("ん")).toBe(false)
    expect(isFullwidthKatakana("ゔ")).toBe(false)
    expect(isFullwidthKatakana("ゕ")).toBe(false)
    expect(isFullwidthKatakana("ゖ")).toBe(false)
  })

  test("test fullwidth katakana", () => {
    expect(isFullwidthKatakana("ア")).toBe(true)
    expect(isFullwidthKatakana("ァ")).toBe(true)
    expect(isFullwidthKatakana("ガ")).toBe(true)
    expect(isFullwidthKatakana("パ")).toBe(true)
    expect(isFullwidthKatakana("ヰ")).toBe(true)
    expect(isFullwidthKatakana("ヱ")).toBe(true)
    expect(isFullwidthKatakana("ン")).toBe(true)
    expect(isFullwidthKatakana("ヷ")).toBe(true)
    expect(isFullwidthKatakana("ヸ")).toBe(true)
    expect(isFullwidthKatakana("ヴ")).toBe(true)
    expect(isFullwidthKatakana("ヺ")).toBe(true)
    expect(isFullwidthKatakana("ヹ")).toBe(true)
    expect(isFullwidthKatakana("ヵ")).toBe(true)
    expect(isFullwidthKatakana("ヶ")).toBe(true)
  })

  test("test halfwidth symbol", () => {
    expect(isFullwidthKatakana("｡")).toBe(false)
    expect(isFullwidthKatakana("｢")).toBe(false)
    expect(isFullwidthKatakana("｣")).toBe(false)
    expect(isFullwidthKatakana("､")).toBe(false)
    expect(isFullwidthKatakana("･")).toBe(false)
    expect(isFullwidthKatakana("ｰ")).toBe(false)
    expect(isFullwidthKatakana("ﾞ")).toBe(false)
    expect(isFullwidthKatakana("ﾟ")).toBe(false)
    expect(isFullwidthKatakana("¢")).toBe(false)
    expect(isFullwidthKatakana("€")).toBe(false)
    expect(isFullwidthKatakana("₩")).toBe(false)
  })

  test("test halfwidth katakana", () => {
    expect(isFullwidthKatakana("ｱ")).toBe(false)
    expect(isFullwidthKatakana("ｧ")).toBe(false)
    expect(isFullwidthKatakana("ｶﾞ")).toBe(false)
    expect(isFullwidthKatakana("ﾊﾟ")).toBe(false)
    expect(isFullwidthKatakana("ｳﾞ")).toBe(false)
    expect(isFullwidthKatakana("ﾝ")).toBe(false)
  })

  test("test fullwidth kanji", () => {
    expect(isFullwidthKatakana("亜")).toBe(false)
    expect(isFullwidthKatakana("腕")).toBe(false)
    expect(isFullwidthKatakana("黑")).toBe(false)
    expect(isFullwidthKatakana("𠮟")).toBe(false)
  })
})
