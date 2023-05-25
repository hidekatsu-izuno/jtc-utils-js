import { describe, expect, test } from 'vitest'
import { formatDate } from '../src/formatDate.js'

describe('formatDate', () => {
  test("test format from string to string", () => {
    expect(formatDate("2000-01-01", "uuuu/M/d")).toBe("2000/1/1")
  })
})
