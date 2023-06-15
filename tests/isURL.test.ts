import { describe, expect, test } from 'vitest'
import { isURL } from '../src/isURL.js'

describe('isURL', () => {

  test("test empty", () => {
    expect(isURL(undefined)).toBe(false)
    expect(isURL(null)).toBe(false)
    expect(isURL("")).toBe(false)
  })

  test("test basic", () => {
    expect(isURL("http://example.com")).toBe(true)
    expect(isURL("https://test.example.co.jp")).toBe(true)
    expect(isURL("https://test.example.co.jp/foo/bar/test.html")).toBe(true)
    expect(isURL("https://test.example.co.jp/foo/bar/test.html?a=1&bb=22&ccc=333")).toBe(true)
    expect(isURL("https://test.example.co.jp/foo/bar/test.html?a=1&bb=22&ccc=333#anchor")).toBe(true)
    expect(isURL("mailto:test@domain.com")).toBe(false)
  })
})
