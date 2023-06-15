import { describe, expect, test } from 'vitest'
import { isFullwidthHiragana } from '../src/isFullwidthHiragana.js'

describe('isFullwidthHiragana', () => {
  test("test empty", () => {
    expect(isFullwidthHiragana(undefined)).toBe(false)
    expect(isFullwidthHiragana(null)).toBe(false)
    expect(isFullwidthHiragana("")).toBe(false)
  })

  test("test basic sequcence", () => {
    expect(isFullwidthHiragana('あいうえお')).toBe(true)
    expect(isFullwidthHiragana('あイうエお')).toBe(false)
    expect(isFullwidthHiragana('アいウえオ')).toBe(false)
  })

  test("test ascii", () => {
    expect(isFullwidthHiragana('\0')).toBe(false)
    expect(isFullwidthHiragana('\t')).toBe(false)
    expect(isFullwidthHiragana('\r')).toBe(false)
    expect(isFullwidthHiragana('\n')).toBe(false)
    expect(isFullwidthHiragana(' ')).toBe(false)
    expect(isFullwidthHiragana('a')).toBe(false)
    expect(isFullwidthHiragana('0')).toBe(false)
    expect(isFullwidthHiragana('@')).toBe(false)
    expect(isFullwidthHiragana('\x7F')).toBe(false)
  })

  test("test fullwidth symbol", () => {
    expect(isFullwidthHiragana("　")).toBe(true)
    expect(isFullwidthHiragana("゠")).toBe(false)
    expect(isFullwidthHiragana("・")).toBe(false)
    expect(isFullwidthHiragana("ー")).toBe(true)
    expect(isFullwidthHiragana("「")).toBe(false)
    expect(isFullwidthHiragana("」")).toBe(false)
    expect(isFullwidthHiragana("、")).toBe(false)
    expect(isFullwidthHiragana("。")).toBe(false)
    expect(isFullwidthHiragana("￠")).toBe(false)
    expect(isFullwidthHiragana("￦")).toBe(false)
    expect(isFullwidthHiragana("｟")).toBe(false)
    expect(isFullwidthHiragana("｠")).toBe(false)
  })

  test("test fullwidth hiragana", () => {
    expect(isFullwidthHiragana("あ")).toBe(true)
    expect(isFullwidthHiragana("ぁ")).toBe(true)
    expect(isFullwidthHiragana("が")).toBe(true)
    expect(isFullwidthHiragana("ぱ")).toBe(true)
    expect(isFullwidthHiragana("ゐ")).toBe(true)
    expect(isFullwidthHiragana("ゑ")).toBe(true)
    expect(isFullwidthHiragana("ん")).toBe(true)
    expect(isFullwidthHiragana("ゔ")).toBe(true)
    expect(isFullwidthHiragana("ゕ")).toBe(true)
    expect(isFullwidthHiragana("ゖ")).toBe(true)
  })

  test("test fullwidth katakana", () => {
    expect(isFullwidthHiragana("ア")).toBe(false)
    expect(isFullwidthHiragana("ァ")).toBe(false)
    expect(isFullwidthHiragana("ガ")).toBe(false)
    expect(isFullwidthHiragana("パ")).toBe(false)
    expect(isFullwidthHiragana("ヰ")).toBe(false)
    expect(isFullwidthHiragana("ヱ")).toBe(false)
    expect(isFullwidthHiragana("ン")).toBe(false)
    expect(isFullwidthHiragana("ヷ")).toBe(false)
    expect(isFullwidthHiragana("ヸ")).toBe(false)
    expect(isFullwidthHiragana("ヴ")).toBe(false)
    expect(isFullwidthHiragana("ヺ")).toBe(false)
    expect(isFullwidthHiragana("ヹ")).toBe(false)
    expect(isFullwidthHiragana("ヵ")).toBe(false)
    expect(isFullwidthHiragana("ヶ")).toBe(false)
  })

  test("test halfwidth symbol", () => {
    expect(isFullwidthHiragana("｡")).toBe(false)
    expect(isFullwidthHiragana("｢")).toBe(false)
    expect(isFullwidthHiragana("｣")).toBe(false)
    expect(isFullwidthHiragana("､")).toBe(false)
    expect(isFullwidthHiragana("･")).toBe(false)
    expect(isFullwidthHiragana("ｰ")).toBe(false)
    expect(isFullwidthHiragana("ﾞ")).toBe(false)
    expect(isFullwidthHiragana("ﾟ")).toBe(false)
    expect(isFullwidthHiragana("¢")).toBe(false)
    expect(isFullwidthHiragana("€")).toBe(false)
    expect(isFullwidthHiragana("₩")).toBe(false)
  })

  test("test halfwidth katakana", () => {
    expect(isFullwidthHiragana("ｱ")).toBe(false)
    expect(isFullwidthHiragana("ｧ")).toBe(false)
    expect(isFullwidthHiragana("ｶﾞ")).toBe(false)
    expect(isFullwidthHiragana("ﾊﾟ")).toBe(false)
    expect(isFullwidthHiragana("ｳﾞ")).toBe(false)
    expect(isFullwidthHiragana("ﾝ")).toBe(false)
  })

  test("test fullwidth kanji", () => {
    expect(isFullwidthHiragana("亜")).toBe(false)
    expect(isFullwidthHiragana("腕")).toBe(false)
    expect(isFullwidthHiragana("黑")).toBe(false)
    expect(isFullwidthHiragana("𠮟")).toBe(false)
  })
})
