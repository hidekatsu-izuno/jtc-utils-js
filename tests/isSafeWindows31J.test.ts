import { describe, expect, test } from 'vitest'
import { isSafeWindows31J } from '../src/isSafeWindows31J.js'

describe('isWindows31J', () => {

  test("test ascii", () => {
    expect(isSafeWindows31J('\x00')).toBe(false)
    expect(isSafeWindows31J('\t')).toBe(true)
    expect(isSafeWindows31J('\r')).toBe(false)
    expect(isSafeWindows31J('\n')).toBe(false)
    expect(isSafeWindows31J(' ')).toBe(true)
    expect(isSafeWindows31J('a')).toBe(true)
    expect(isSafeWindows31J('0')).toBe(true)
    expect(isSafeWindows31J('@')).toBe(true)
    expect(isSafeWindows31J('\x7F')).toBe(false)
  })

  test("test fullwidth symbol", () => {
    expect(isSafeWindows31J("　")).toBe(true)
    expect(isSafeWindows31J("、")).toBe(true)
    expect(isSafeWindows31J("￦")).toBe(false)
  })

  test("test fullwidth kanji", () => {
    expect(isSafeWindows31J("亜")).toBe(true)
    expect(isSafeWindows31J("腕")).toBe(true)
  })
})
