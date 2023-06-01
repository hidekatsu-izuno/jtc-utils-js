import { describe, expect, test } from 'vitest'
import { formatDate } from '../src/formatDate.js'

describe('formatDate', () => {
  test("test format from string to string", () => {
    expect(formatDate("2000-01-01", "uuuu/M/d")).toBe("2000/1/1")
  })

  test("test format from string with tz to string", () => {
    const current = Intl.DateTimeFormat().resolvedOptions().timeZone
    expect(formatDate("2000-01-01 00:00:00", "uuuu/M/d H:m:s", current)).toBe("2000/1/1 0:0:0")
    expect(formatDate("2000-01-01 00:00:00", "uuuu/M/d H:m:s", "UTC")).toBe("1999/12/31 15:0:0")
  })
})
