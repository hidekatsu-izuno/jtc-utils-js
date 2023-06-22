import { describe, expect, test } from "vitest"
import { CsvReader } from "../src/CsvReader"
import fs from "node:fs"
import { Readable } from "node:stream"

describe('CsvReader', () => {

  test.each([
    ["", []],
    ["あいう", [["あいう"]]],
    ["あいう\n", [["あいう"]]],
    ["\"あい\"\"う\"\n", [["あい\"う"]]],
    ["\"あい\"\"う\"\r\n", [["あい\"う"]]],
    ["あいう,えお", [["あいう", "えお"]]],
    ["あいう,えお\n", [["あいう", "えお"]]],
    ["\"あい\"\"う\",えお", [["あい\"う", "えお"]]],
    ["あいう,\"え\nお\"\n", [["あいう", "え\nお"]]],
    ["あいう,\"え\nお\"\nかきく,\"け\nこ\"", [["あいう", "え\nお"],["かきく", "け\nこ"]]],
    ["あいう,\"え\nお\"\n\"かき\"\"く\",けこ\r\n", [["あいう", "え\nお"],["かき\"く", "けこ"]]],
  ])("test read string %j", async (input, expected) => {
    const reader = new CsvReader(input)
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

  test("test read string for a bug", async () => {
    const reader = new CsvReader("あいう,\"え\nお\"\nかきく,\"け\nこ\"")
    try {
      const list = new Array<any>()
      for await (const item of reader.read()) {
        list.push(item)
      }
      expect(list).toStrictEqual([["あいう", "え\nお"],["かきく", "け\nこ"]])
    } finally {
      await reader.close()
    }
  })

  test("test read utf-8 csv with bom", async () => {
    const stream = fs.createReadStream(__dirname + "/data/sample.utf-8.bom.csv")
    const reader = new CsvReader(Readable.toWeb(stream) as ReadableStream<Uint8Array>)
    try {
      const list = new Array<any>()
      for await (const item of reader.read()) {
        list.push(item)
      }
      expect(list).toStrictEqual([
        ["昔々","あるところに","grand father,mother","桃\r\n太郎"],
        ["住んでいました。"],
      ])
    } finally {
      await reader.close()
    }
  })

  test("test read utf-8 csv without bom", async () => {
    const stream = fs.createReadStream(__dirname + "/data/sample.utf-8.nobom.csv")
    const reader = new CsvReader(Readable.toWeb(stream) as ReadableStream<Uint8Array>)
    try {
      const list = new Array<any>()
      for await (const item of reader.read()) {
        list.push(item)
      }
      expect(list).toStrictEqual([
        ["昔々","あるところに","grand father,mother","桃\r\n太郎"],
        ["住んでいました。"],
      ])
    } finally {
      await reader.close()
    }
  })

  test("test read windows-31j csv", async () => {
    const stream = fs.createReadStream(__dirname + "/data/sample.windows-31j.csv")
    const reader = new CsvReader(Readable.toWeb(stream) as ReadableStream<Uint8Array>, {
      encoding: "windows-31j"
    })
    try {
      const list = new Array<any>()
      for await (const item of reader.read()) {
        list.push(item)
      }
      expect(list).toStrictEqual([
        ["昔々","あるところに","grand father,mother","桃\r\n太郎"],
        ["住んでいました。"],
      ])
    } finally {
      await reader.close()
    }
  })
})
