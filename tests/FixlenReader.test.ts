import { describe, expect, test } from "vitest"
import { FixlenReader } from "../src/FixlenReader"
import fs from "node:fs"
import { Readable } from "node:stream"

describe('FixlenReader', () => {
  test.each([
    ["", []],
  ])("test read string %j", async (input, expected) => {
    const reader = new FixlenReader(input, 8, {
      columns: [
      /*
        { start: 0 },
        { start: 5, end: 9 },
      */
      ]
    })
    try {
      const list = new Array<any>()
      for await (const item of reader.read()) {
        list.push(item)
      }
      expect(list).toStrictEqual(expected)
    } finally {
      await reader.close()
    }
  })
})
