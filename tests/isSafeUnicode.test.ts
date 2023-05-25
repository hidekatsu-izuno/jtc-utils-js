import { describe, expect, test } from 'vitest'
import { isSafeUnicode } from '../src/isSafeUnicode.js'

describe('isSafeUnicode', () => {
  test("test safe unicode", () => {
    expect(isSafeUnicode("\0")).toBe(false)
    expect(isSafeUnicode("\t")).toBe(true)
    expect(isSafeUnicode("\r")).toBe(false)
    expect(isSafeUnicode("\n")).toBe(false)
    expect(isSafeUnicode(" ")).toBe(true)
    expect(isSafeUnicode("A")).toBe(true)
    expect(isSafeUnicode("a")).toBe(true)
    expect(isSafeUnicode("0")).toBe(true)
    expect(isSafeUnicode(".")).toBe(true)
    expect(isSafeUnicode("あ")).toBe(true)
    expect(isSafeUnicode("ア")).toBe(true)
    expect(isSafeUnicode("ｱ")).toBe(true)
    expect(isSafeUnicode("\uD800")).toBe(false)
    expect(isSafeUnicode("\uDC00")).toBe(false)
    expect(isSafeUnicode("\uD800\uDC00")).toBe(true)
    expect(isSafeUnicode("\uFDD0")).toBe(false)
    expect(isSafeUnicode("\uFDEF")).toBe(false)
    expect(isSafeUnicode("\uFEF0")).toBe(true)
    expect(isSafeUnicode("\uFEFF")).toBe(false)
    expect(isSafeUnicode("\uFFF0")).toBe(false)
    expect(isSafeUnicode("\uFFFE")).toBe(false)
    expect(isSafeUnicode("\uFFFF")).toBe(false)
    expect(isSafeUnicode("\u{1FFFE}")).toBe(false)
    expect(isSafeUnicode("\u{1FFFF}")).toBe(false)
    expect(isSafeUnicode("\u{10FFFE}")).toBe(false)
    expect(isSafeUnicode("\u{10FFFF}")).toBe(false)
  })

  test("test safe unicode with linebreak", () => {
    expect(isSafeUnicode("\r", { linebreak: true })).toBe(true)
    expect(isSafeUnicode("\n", { linebreak: true })).toBe(true)
  })
})
