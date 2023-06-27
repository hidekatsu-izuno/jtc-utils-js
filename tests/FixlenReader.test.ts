import { describe, expect, test } from "vitest"
import { FixlenReader } from "../src/FixlenReader"
import fs from "node:fs"
import { Readable } from "node:stream"

describe('FixlenReader', () => {
  test("test read string", async () => {
    const reader = new FixlenReader("01234567890123456789", 10, {
      columns: [{ start: 0 }, { start: 3, end: 6 }, { start: 7 }]
    })
    try {
      const list = new Array<any>()
      for await (const item of reader.read()) {
        list.push(item)
      }
      expect(list).toStrictEqual([
        ["012", "345", "789"],
        ["012", "345", "789"]
      ])
    } finally {
      await reader.close()
    }
  })

  test("test read string with linebreak", async () => {
    const reader = new FixlenReader("0123456789\r\n0123456789\r\n", 12, {
      columns: [{ start: 0 }, { start: 3, end: 6 }, { start: 7, end: 10 }]
    })
    try {
      const list = new Array<any>()
      for await (const item of reader.read()) {
        list.push(item)
      }
      expect(list).toStrictEqual([
        ["012", "345", "789"],
        ["012", "345", "789"]
      ])
    } finally {
      await reader.close()
    }
  })

  test("test read shift_jis string with linebreak", async () => {
    const reader = new FixlenReader("0123４５６789\r\n0123４５６789\r\n", 15, {
      encoding: "shift_jis",
      columns: [{ start: 0 }, { start: 3, end: 8 }, { start: 10, end: 13 }]
    })
    try {
      const list = new Array<any>()
      for await (const item of reader.read()) {
        list.push(item)
      }
      expect(list).toStrictEqual([
        ["012", "3４５", "789"],
        ["012", "3４５", "789"]
      ])
    } finally {
      await reader.close()
    }
  })

  test("test read mutiple layout shift_jis with linebreak", async () => {
    const layout1 = [{ start: 1, end: 11 }]
    const layout2 = [{ start: 1 }, { start: 6 }, { start: 11, end: 16 }]

    const reader = new FixlenReader("1あいうえお     \r\n0ABCDEabcde01234\r\n", 18, {
      encoding: "shift_jis",
      columns: (status) => {
        const flag = status.value({ start: 0, end: 1 })
        return (flag === "1") ? layout1 : layout2
      }
    })
    try {
      const list = new Array<any>()
      for await (const item of reader.read()) {
        list.push(item)
      }
      expect(list).toStrictEqual([
        ["あいうえお"],
        ["ABCDE", "abcde", "01234"]
      ])
    } finally {
      await reader.close()
    }
  })
})
