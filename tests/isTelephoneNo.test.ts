import { describe, expect, test } from "vitest"
import { isTelephoneNo } from "../src/isTelephoneNo.js"

describe('isTelephoneNo', () => {

  test("test empty", () => {
    expect(isTelephoneNo(undefined)).toBe(false)
    expect(isTelephoneNo(null)).toBe(false)
    expect(isTelephoneNo("")).toBe(false)
  })

  test("test basic", () => {
    expect(isTelephoneNo("0312345678")).toBe(true)
    expect(isTelephoneNo("090123456789012")).toBe(true)
    expect(isTelephoneNo("0901234567890123")).toBe(false)
    expect(isTelephoneNo("03-1234-5678")).toBe(true)
    expect(isTelephoneNo("090-12345-6-789012")).toBe(true)
    expect(isTelephoneNo("(090)1234-5678")).toBe(true)
    expect(isTelephoneNo("(090) 12345-6-789012")).toBe(true)
    expect(isTelephoneNo("81-90-1234-5678901")).toBe(true)
    expect(isTelephoneNo("+81-90-1234-5678901")).toBe(true)
    expect(isTelephoneNo("+81(90)1234-5678901")).toBe(true)
    expect(isTelephoneNo("+81 (090) 1234-567890")).toBe(true)
    expect(isTelephoneNo("+0812 (090) 1234-5678")).toBe(false)
  })
})
