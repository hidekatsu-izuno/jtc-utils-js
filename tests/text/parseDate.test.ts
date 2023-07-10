import { describe, expect, test } from "vitest"
import { parseDate } from "../../src/text/parseDate.js"
import { getTimeZone } from "../../src/getTimeZone.js"

describe('formatDate', () => {
  test("test parse from string", () => {
    expect(parseDate("2000/01/01", "uuuu/M/d")).toStrictEqual(new Date(2000, 0, 1))
  })

  test("test parse from string with tz", () => {
    const current = getTimeZone()
    expect(parseDate("2000/01/01 00:00:00", "uuuu/M/d H:m:s", { timeZone: current })).toStrictEqual(new Date(2000, 0, 1, 0, 0))
    expect(parseDate("2000/01/01 00:00:00", "uuuu/M/d H:m:s", { timeZone: "UTC" })).toStrictEqual(new Date(1999, 11, 31, 15))
  })
})
