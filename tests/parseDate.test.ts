import assert from "node:assert/strict"
import { describe, test } from "vitest"
import { jaJPUCaJapanese } from "../src/locale/jaJPUCaJapanese.js"
import { parseDate } from "../src/parseDate.js"
import { getTimeZone } from "../src/util/getTimeZone.js"

describe("formatDate", () => {
  test("test parse by no format", () => {
    assert.deepEqual(parseDate("2000-01-01"), new Date(2000, 0, 1))
    assert.deepEqual(parseDate("20000101"), new Date(2000, 0, 1))
  })

  test("test parse from string", () => {
    assert.deepEqual(parseDate("2000/01/01", "uuuu/M/d"),
      new Date(2000, 0, 1),
    )
  })

  test("test parse from string with tz", () => {
    const current = getTimeZone()
    assert.deepEqual(
      parseDate("2000/01/01 00:00:00", "uuuu/M/d H:m:s", { timeZone: current }),
      new Date(2000, 0, 1, 0, 0))
    assert.deepEqual(
      parseDate("2000/01/01 00:00:00", "uuuu/M/d H:m:s", { timeZone: "UTC" }),
      new Date(2000, 0, 1, 9))
    assert.deepEqual(
      parseDate("2000/01/01 00:00:00Z", "uuuu/MM/dd H:m:sX", {
        timeZone: current,
      }),
      new Date(2000, 0, 1, 9))
    assert.deepEqual(
      parseDate("2000/01/01 00:00:00Z", "uuuu/MM/dd H:m:sX", {
        timeZone: "UTC",
      }),
      new Date(2000, 0, 1, 9))
    assert.deepEqual(
      parseDate("2000/01/01 00:00:00+0000", "uuuu/MM/dd H:m:sx", {
        timeZone: current,
      }),
      new Date(2000, 0, 1, 9))
    assert.deepEqual(
      parseDate("2000/01/01 00:00:00+0000", "uuuu/MM/dd H:m:sx", {
        timeZone: "UTC",
      }),
      new Date(2000, 0, 1, 9))
    assert.deepEqual(
      parseDate("2000-01-01 00:00:00", undefined, { timeZone: current }),
      new Date(2000, 0, 1, 0))
    assert.deepEqual(
      parseDate("2000-01-01 00:00:00", undefined, { timeZone: "UTC" }),
      new Date(2000, 0, 1, 9))
    assert.deepEqual(
      parseDate("2000-01-01 00:00:00+00:00", undefined, { timeZone: current }),
      new Date(2000, 0, 1, 9))
    assert.deepEqual(
      parseDate("2000-01-01 00:00:00+00:00", undefined, { timeZone: "UTC" }),
      new Date(2000, 0, 1, 9))
  })

  test("test parse japanese calendar", () => {
    assert.deepEqual(
      parseDate("平成12/1/1", "Gyyyy/M/d", { locale: jaJPUCaJapanese }),
      new Date(2000, 0, 1))
  })
})
