import { describe, expect, test } from 'vitest'
import { parseDate } from '../src/parseDate.js'

describe('formatDate', () => {
  test("test parse from string", () => {
    expect(parseDate("2000/01/01", "uuuu/M/d")).toStrictEqual(new Date(2000, 0, 1))
  })

  test("test parse from string with tz", () => {
    const current = Intl.DateTimeFormat().resolvedOptions().timeZone
    expect(parseDate("2000/01/01 00:00:00", "uuuu/M/d H:m:s", current)).toStrictEqual(new Date(2000, 0, 1, 0, 0))
    expect(parseDate("2000/01/01 00:00:00", "uuuu/M/d H:m:s", "UTC")).toStrictEqual(new Date(1999, 11, 31, 15))
  })
})
