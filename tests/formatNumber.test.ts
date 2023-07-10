import { describe, expect, test } from "vitest"
import { formatNumber } from "../src/formatNumber.js"

describe('formatNumber', () => {
  test("test format from number to string", () => {
    expect(formatNumber(0, "######")).toBe("0")
    expect(formatNumber(0, "###,###")).toBe("0")
    expect(formatNumber(0, "###,###.#")).toBe("0")
    expect(formatNumber(0, "###,###.0")).toBe("0.0")

    expect(formatNumber(10000, "######")).toBe("10000")
    expect(formatNumber(10000, "###,###")).toBe("10,000")
    expect(formatNumber(10000, "###,###.#")).toBe("10,000")
    expect(formatNumber(10000, "###,###.0")).toBe("10,000.0")

    expect(formatNumber(-10000, "######")).toBe("-10000")
    expect(formatNumber(-10000, "###,###")).toBe("-10,000")
    expect(formatNumber(-10000, "###,###.#")).toBe("-10,000")
    expect(formatNumber(-10000, "###,###.0")).toBe("-10,000.0")
  })
})
