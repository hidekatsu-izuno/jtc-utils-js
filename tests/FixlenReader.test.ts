import { describe, expect, test } from "vitest"
import { FixlenReader, FixlenReaderLayout } from "../src/FixlenReader"
import { windows31j } from "../src/charset/windows31j"

describe('FixlenReader', () => {
  test("test read string", async () => {
    const reader = new FixlenReader("01234567890123456789")

    const layout = { lineLength: 10, columns: [{ start: 0 }, { start: 3, length: 3 }, { start: 7 }] }
    try {
      const list = new Array<any>()
      for await (const item of reader.read(layout)) {
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
    const reader = new FixlenReader("0123456789\r\n0123456789\r\n")

    const layout = { lineLength: 12, columns: [{ start: 0 }, { start: 3, length: 3 }, { start: 7, length: 3 }] }
    try {
      const list = new Array<any>()
      for await (const item of reader.read(layout)) {
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
    const reader = new FixlenReader("0123４５６789\r\n0123４５６789\r\n", {
      charset: windows31j,
    })

    const layout = { lineLength: 15, columns: [{ start: 0 }, { start: 3, length: 5 }, { start: 10, length: 3 }] }
    try {
      const list = new Array<any>()
      for await (const item of reader.read(layout)) {
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
    const columns1 = [{ start: 1, length: 10 }]
    const columns2 = [{ start: 1 }, { start: 6 }, { start: 11, length: 5 }]
    const layout: FixlenReaderLayout = {
      lineLength: 18,
      columns(line) {
        const flag = line.decode({ start: 0, length: 1 })
        return (flag === "1") ? columns1 : columns2
      }
    }

    const reader = new FixlenReader("1あいうえお     \r\n0ABCDEabcde01234\r\n", {
      charset: windows31j
    })
    try {
      const list = new Array<any>()
      for await (const item of reader.read(layout)) {
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
