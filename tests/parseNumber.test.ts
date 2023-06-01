import { describe, expect, test } from 'vitest'
import { parseNumber } from '../src/parseNumber.js'

describe('parseNumber', () => {
  test("test parse from string", () => {
    expect(parseNumber("0", "######")).toBe(0)
    expect(parseNumber("0", "###,###")).toBe(0)
    expect(parseNumber("0", "###,###.#")).toBe(0)
    expect(parseNumber("0.0", "###,###.#")).toBe(0)
    expect(parseNumber("0.01", "###,###.#")).toBe(0.01)
    expect(parseNumber("0", "###,###.0")).toBe(0)
    expect(parseNumber("0.0", "###,###.0")).toBe(0)
    expect(parseNumber("0.01", "###,###.0")).toBe(0.01)

    expect(parseNumber("10000", "######")).toBe(10000)
    expect(parseNumber("10,000", "###,###")).toBe(10000)
    expect(parseNumber("10,000", "###,###.#")).toBe(10000)
    expect(parseNumber("10,000.0", "###,###.0")).toBe(10000)

    expect(parseNumber("-10000", "######")).toBe(-10000)
    expect(parseNumber("-10,000", "###,###")).toBe(-10000)
    expect(parseNumber("-10,000", "###,###.#")).toBe(-10000)
    expect(parseNumber("-10,000.0", "###,###.0")).toBe(-10000)
  })
})
