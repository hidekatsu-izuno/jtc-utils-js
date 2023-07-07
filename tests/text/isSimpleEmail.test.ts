import { describe, expect, test } from "vitest"
import { isSimpleEmail } from "../../src/text/isSimpleEmail.js"

describe('isSimpleEmail', () => {

  test("test empty", () => {
    expect(isSimpleEmail(undefined)).toBe(false)
    expect(isSimpleEmail(null)).toBe(false)
    expect(isSimpleEmail("")).toBe(false)
  })

  test("test basic", () => {
    expect(isSimpleEmail("test@domain.com")).toBe(true)
    expect(isSimpleEmail("test.sample@domain_domain.co.jp")).toBe(false)
    expect(isSimpleEmail("test.sample@domain-domain.co.jp")).toBe(true)
    expect(isSimpleEmail("test.@domain.ne.fr")).toBe(true)
  })
})
