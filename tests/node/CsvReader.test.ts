import { describe, expect, test } from "vitest"
import fs from "node:fs"
import { CsvReader } from "../../src/node/CsvReader.js"
import { windows31j } from "../../src/charset/windows31j.js"

describe('node.CsvReader', () => {

  test("test read string csv", async () => {
    const reader = new CsvReader("あいう,かきく")
    try {
      const list = new Array<any>()
      for await (const item of reader.read()) {
        list.push(item)
      }
      expect(list).toStrictEqual([
        ["あいう", "かきく"]
      ])
    } finally {
      await reader.close()
    }
  })

  test("test read utf-8 csv with bom", async () => {
    const reader = new CsvReader(fs.createReadStream(__dirname + "/../data/sample.utf-8.bom.csv"))
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
    const reader = new CsvReader(fs.createReadStream(__dirname + "/../data/sample.utf-8.nobom.csv"))
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
    const reader = new CsvReader(fs.createReadStream(__dirname + "/../data/sample.windows-31j.csv"), {
      charset: windows31j
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
