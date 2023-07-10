import { describe, expect, test } from "vitest"
import { formatDate } from "../../src/text/formatDate.js"
import { getTimeZone } from "../../src/getTimeZone.js"

describe('formatDate', () => {
  test("test format from string to string", () => {
    expect(formatDate("2000-01-01", "uuuu/M/d")).toBe("2000/1/1")
  })

  test("test format from string with tz to string", () => {
    const current = getTimeZone()
    expect(formatDate("2000-01-01 00:00:00", "uuuu/M/d H:m:s", { timeZone: current })).toBe("2000/1/1 0:0:0")
    expect(formatDate("2000-01-01 00:00:00", "uuuu/M/d H:m:s", { timeZone: "UTC" })).toBe("1999/12/31 15:0:0")
  })
})
