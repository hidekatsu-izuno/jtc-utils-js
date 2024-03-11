import { describe, expect, test } from "vitest"
import { parseDate } from "../src/parseDate.js"
import { getTimeZone } from "../src/util/getTimeZone.js"
import { jaJPUCaJapanese } from "../src/locale/jaJPUCaJapanese.js"

describe("formatDate", () => {
  test("test parse by no format", () => {
    expect(parseDate("2000-01-01")).toStrictEqual(new Date(2000, 0, 1))
    expect(parseDate("20000101")).toStrictEqual(new Date(2000, 0, 1))
  })

  test("test parse from string", () => {
    expect(parseDate("2000/01/01", "uuuu/M/d")).toStrictEqual(new Date(2000, 0, 1))
  })

  test("test parse from string with tz", () => {
    const current = getTimeZone()
    expect(parseDate("2000/01/01 00:00:00", "uuuu/M/d H:m:s", { timeZone: current })).toStrictEqual(new Date(2000, 0, 1, 0, 0))
    expect(parseDate("2000/01/01 00:00:00", "uuuu/M/d H:m:s", { timeZone: "UTC" })).toStrictEqual(new Date(2000, 0, 1, 9))
    expect(parseDate("2000/01/01 00:00:00Z", "uuuu/MM/dd H:m:sX", { timeZone: current })).toStrictEqual(new Date(2000, 0, 1, 9))
    expect(parseDate("2000/01/01 00:00:00Z", "uuuu/MM/dd H:m:sX", { timeZone: "UTC" })).toStrictEqual(new Date(2000, 0, 1, 9))
    expect(parseDate("2000/01/01 00:00:00+0000", "uuuu/MM/dd H:m:sx", { timeZone: current })).toStrictEqual(new Date(2000, 0, 1, 9))
    expect(parseDate("2000/01/01 00:00:00+0000", "uuuu/MM/dd H:m:sx", { timeZone: "UTC" })).toStrictEqual(new Date(2000, 0, 1, 9))
    expect(parseDate("2000-01-01 00:00:00", undefined, { timeZone: current })).toStrictEqual(new Date(2000, 0, 1, 0))
    expect(parseDate("2000-01-01 00:00:00", undefined, { timeZone: "UTC" })).toStrictEqual(new Date(2000, 0, 1, 9))
    expect(parseDate("2000-01-01 00:00:00+00:00", undefined, { timeZone: current })).toStrictEqual(new Date(2000, 0, 1, 9))
    expect(parseDate("2000-01-01 00:00:00+00:00", undefined, { timeZone: "UTC" })).toStrictEqual(new Date(2000, 0, 1, 9))
  })

  test("test parse japanese calendar", () => {
    expect(parseDate("平成12/1/1", "Gyyyy/M/d", { locale: jaJPUCaJapanese })).toStrictEqual(new Date(2000, 0, 1))
  })
})
