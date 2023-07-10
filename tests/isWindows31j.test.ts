import { describe, expect, test } from "vitest"
import { isWindows31j } from "../src/isWindows31j.js"

describe('isWindows31j', () => {

  test("test no string", () => {
    expect(isWindows31j(undefined)).toBe(false)
    expect(isWindows31j(null)).toBe(false)
    expect(isWindows31j("")).toBe(false)
  })

  test("test basic sequcence", () => {
    expect(isWindows31j('ｱｲｳｴｵｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ')).toBe(true)
    expect(isWindows31j('あｲｳｴｵｶﾞｷﾞｸﾞゲｺﾞﾊﾟﾋﾟﾌﾟﾍﾟぽ')).toBe(true)
    expect(isWindows31j('ｱいｳエｵガｷﾞぐｹﾞゴﾊﾟぴﾌﾟプﾎﾟ')).toBe(true)
    expect(isWindows31j('亜いｳエｵガｷﾞ具ｹﾞゴﾊﾟぴプﾎﾟ')).toBe(true)
  })

  test("test ascii", () => {
    expect(isWindows31j('\0')).toBe(true)
    expect(isWindows31j('\t')).toBe(true)
    expect(isWindows31j('\r')).toBe(true)
    expect(isWindows31j('\n')).toBe(true)
    expect(isWindows31j(' ')).toBe(true)
    expect(isWindows31j('a')).toBe(true)
    expect(isWindows31j('0')).toBe(true)
    expect(isWindows31j('@')).toBe(true)
    expect(isWindows31j('\x7F')).toBe(true)
  })

  test("test fullwidth hiragana", () => {
    expect(isWindows31j("あ")).toBe(true)
    expect(isWindows31j("ぁ")).toBe(true)
    expect(isWindows31j("が")).toBe(true)
    expect(isWindows31j("ぱ")).toBe(true)
  })

  test("test fullwidth katakana", () => {
    expect(isWindows31j("ア")).toBe(true)
    expect(isWindows31j("ァ")).toBe(true)
    expect(isWindows31j("ガ")).toBe(true)
    expect(isWindows31j("パ")).toBe(true)
    expect(isWindows31j("ヴ")).toBe(true)
  })

  test("test halfwidth katakana", () => {
    expect(isWindows31j("ｱ")).toBe(true)
    expect(isWindows31j("ｧ")).toBe(true)
    expect(isWindows31j("ｶﾞ")).toBe(true)
    expect(isWindows31j("ﾊﾟ")).toBe(true)
    expect(isWindows31j("ｳﾞ")).toBe(true)
  })

  test("test fullwidth symbol", () => {
    expect(isWindows31j("　")).toBe(true)
    expect(isWindows31j("、")).toBe(true)
    expect(isWindows31j("￦")).toBe(false)
  })

  test("test fullwidth kanji", () => {
    expect(isWindows31j("亜")).toBe(true)
    expect(isWindows31j("腕")).toBe(true)
    expect(isWindows31j("黑")).toBe(true)
    expect(isWindows31j("𠮟")).toBe(false)
  })
})
