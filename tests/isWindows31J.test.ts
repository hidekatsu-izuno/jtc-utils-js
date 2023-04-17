import { describe, expect, test } from 'vitest'
import isWindows31J from '../src/isWindows31J.js'

describe('isWindows31J', () => {

  test.each((() => {
      const asciiList = new Array<string>()
      for (let i = 0x00; i <= 0x7F; i++) {
        asciiList.push(String.fromCharCode(i))
      }
      return asciiList
  })())("test ascii '%s'", (c) => {
      expect(isWindows31J(c)).toBe(true)
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
