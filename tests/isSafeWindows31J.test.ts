import { describe, expect, test } from 'vitest'
import isSafeWindows31J from '../src/isSafeWindows31J.js'

describe('isWindows31J', () => {

  test.each((() => {
      const asciiList = new Array<string>()
      for (let i = 0x00; i <= 0x7F; i++) {
        asciiList.push(String.fromCharCode(i))
      }
      return asciiList
  })())("test ascii '%s'", (c) => {
    expect(isSafeWindows31J(c)).toBe(true)
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
