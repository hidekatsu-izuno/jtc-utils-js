import { describe, expect, test } from 'vitest'
import { isWindows31J } from '../src/isWindows31J.js'

describe('isWindows31J', () => {

  test("test ascii", () => {
    expect(isWindows31J('\0')).toBe(true)
    expect(isWindows31J('\t')).toBe(true)
    expect(isWindows31J('\r')).toBe(true)
    expect(isWindows31J('\n')).toBe(true)
    expect(isWindows31J(' ')).toBe(true)
    expect(isWindows31J('a')).toBe(true)
    expect(isWindows31J('0')).toBe(true)
    expect(isWindows31J('@')).toBe(true)
    expect(isWindows31J('\x7F')).toBe(true)
  })

  test("test fullwidth hiragana", () => {
    expect(isWindows31J("あ")).toBe(true)
    expect(isWindows31J("ぁ")).toBe(true)
    expect(isWindows31J("が")).toBe(true)
    expect(isWindows31J("ぱ")).toBe(true)
  })

  test("test fullwidth katakana", () => {
    expect(isWindows31J("ア")).toBe(true)
    expect(isWindows31J("ァ")).toBe(true)
    expect(isWindows31J("ガ")).toBe(true)
    expect(isWindows31J("パ")).toBe(true)
    expect(isWindows31J("ヴ")).toBe(true)
  })

  test("test halfwidth katakana", () => {
    expect(isWindows31J("ｱ")).toBe(true)
    expect(isWindows31J("ｧ")).toBe(true)
    expect(isWindows31J("ｶﾞ")).toBe(true)
    expect(isWindows31J("ﾊﾟ")).toBe(true)
    expect(isWindows31J("ｳﾞ")).toBe(true)
  })

  test("test fullwidth symbol", () => {
    expect(isWindows31J("　")).toBe(true)
    expect(isWindows31J("、")).toBe(true)
    expect(isWindows31J("￦")).toBe(false)
  })

  test("test fullwidth kanji", () => {
    expect(isWindows31J("亜")).toBe(true)
    expect(isWindows31J("腕")).toBe(true)
    expect(isWindows31J("黑")).toBe(true)
    expect(isWindows31J("𠮟")).toBe(false)
  })
})
