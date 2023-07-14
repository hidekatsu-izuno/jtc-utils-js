import { describe, expect, test } from "vitest"
import { isHttpURL } from "../src/isHttpURL.js"

describe('isHttpURL', () => {

  test("test empty", () => {
    expect(isHttpURL(undefined)).toBe(false)
    expect(isHttpURL(null)).toBe(false)
    expect(isHttpURL("")).toBe(false)
  })

  test("test basic", () => {
    expect(isHttpURL("http://example.com")).toBe(true)
    expect(isHttpURL("https://test.example.co.jp")).toBe(true)
    expect(isHttpURL("https://test.example.co.jp/foo/bar/test.html")).toBe(true)
    expect(isHttpURL("https://test.example.co.jp/foo/bar/test.html?a=1&bb=22&ccc=333")).toBe(true)
    expect(isHttpURL("https://test.example.co.jp/foo/bar/test.html?a=1&bb=22&ccc=333#anchor")).toBe(true)
    expect(isHttpURL("mailto:test@domain.com")).toBe(false)
    expect(isHttpURL("ftp://test.example.co.jp")).toBe(false)
    expect(isHttpURL("file:///test.example.co.jp")).toBe(false)
  })
})
