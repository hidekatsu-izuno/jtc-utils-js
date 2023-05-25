import { describe, expect, test } from 'vitest'
import { isWindows31J } from '../src/isWindows31J.js'

describe('isWindows31J', () => {

  test("test ascii", () => {
    expect(isWindows31J('\x00')).toBe(false)
    expect(isWindows31J('\t')).toBe(true)
    expect(isWindows31J('\r')).toBe(false)
    expect(isWindows31J('\n')).toBe(false)
    expect(isWindows31J(' ')).toBe(true)
    expect(isWindows31J('a')).toBe(true)
    expect(isWindows31J('0')).toBe(true)
    expect(isWindows31J('@')).toBe(true)
    expect(isWindows31J('\x7F')).toBe(false)
  })

  test("test fullwidth symbol", () => {
    expect(isWindows31J("　")).toBe(true)
    expect(isWindows31J("、")).toBe(true)
    expect(isWindows31J("￦")).toBe(false)
  })

  test("test fullwidth kanji", () => {
    expect(isWindows31J("亜")).toBe(true)
    expect(isWindows31J("腕")).toBe(true)
  })
})
