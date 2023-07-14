import { describe, expect, test } from "vitest"
import { isWebSafeString } from "../src/isWebSafeString.js"

describe("isWebSafeString", () => {

  test("test no string", () => {
    expect(isWebSafeString(undefined)).toBe(false)
    expect(isWebSafeString(null)).toBe(false)
    expect(isWebSafeString("")).toBe(true)
  })

  test("test basic sequcence", () => {
    expect(isWebSafeString("ｱｲｳｴｵｶﾞｷﾞｸﾞｹﾞｺﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ")).toBe(true)
    expect(isWebSafeString("あｲｳｴｵｶﾞｷﾞｸﾞゲｺﾞﾊﾟﾋﾟﾌﾟﾍﾟぽ")).toBe(true)
    expect(isWebSafeString("ｱいｳエｵガｷﾞぐｹﾞゴﾊﾟぴﾌﾟプﾎﾟ")).toBe(true)
    expect(isWebSafeString("亜いｳエｵガｷﾞ具ｹﾞゴﾊﾟぴプﾎﾟ")).toBe(true)
    expect(isWebSafeString("\uFEFF")).toBe(false)
    expect(isWebSafeString("\uE000")).toBe(false)
    expect(isWebSafeString("\uD800")).toBe(false)
  })

  test("test ascii", () => {
    expect(isWebSafeString("\0")).toBe(false)
    expect(isWebSafeString("\t")).toBe(true)
    expect(isWebSafeString("\r")).toBe(true)
    expect(isWebSafeString("\n")).toBe(true)
    expect(isWebSafeString(" ")).toBe(true)
    expect(isWebSafeString("a")).toBe(true)
    expect(isWebSafeString("0")).toBe(true)
    expect(isWebSafeString("@")).toBe(true)
    expect(isWebSafeString("\x7F")).toBe(false)
  })

  test("test special", () => {
    expect(isWebSafeString("\uFFF0")).toBe(false)
    expect(isWebSafeString("\uFFF1")).toBe(false)
    expect(isWebSafeString("\uFFF2")).toBe(false)
    expect(isWebSafeString("\uFFF3")).toBe(false)
    expect(isWebSafeString("\uFFF4")).toBe(false)
    expect(isWebSafeString("\uFFF5")).toBe(false)
    expect(isWebSafeString("\uFFF6")).toBe(false)
    expect(isWebSafeString("\uFFF7")).toBe(false)
    expect(isWebSafeString("\uFFF8")).toBe(false)
    expect(isWebSafeString("\uFFF9")).toBe(false)
    expect(isWebSafeString("\uFFFA")).toBe(false)
    expect(isWebSafeString("\uFFFB")).toBe(false)
    expect(isWebSafeString("\uFFFC")).toBe(false)
    expect(isWebSafeString("\uFFFD")).toBe(false)
    expect(isWebSafeString("\uFFFE")).toBe(false)
    expect(isWebSafeString("\uFFFF")).toBe(false)
  })
})
