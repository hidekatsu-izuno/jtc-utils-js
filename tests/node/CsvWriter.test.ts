import { describe, expect, test } from "vitest"
import { MemoryWritable } from "../../src/node/MemoryWritable"
import { CsvWriter } from "../../src/node/CsvWriter"
import { windows31j } from "../../src/charset/windows31j.js"

describe('node.CsvWriter', () => {
  test("test write utf-8 csv with bom", async () => {
    const buf = new MemoryWritable()

    const writer = new CsvWriter(buf)
    try {
      writer.write(["aaa", "b\"b\nb", "ccc"])
      writer.write(["あいう"])
    } finally {
      await writer.close()
    }

    expect(buf.toString("utf-8")).toStrictEqual("\uFEFFaaa,\"b\"\"b\nb\",ccc\r\nあいう\r\n")
  })

  test("test write utf-8 csv without bom", async () => {
    const buf = new MemoryWritable()

    const writer = new CsvWriter(buf, {
      bom: false
    })
    try {
      writer.write(["aaa", "b\"b\nb", "ccc"])
      writer.write(["あいう"])
    } finally {
      await writer.close()
    }

    expect(buf.toString("utf-8")).toStrictEqual("aaa,\"b\"\"b\nb\",ccc\r\nあいう\r\n")
  })

  test("test write windows-31j csv", async () => {
    const buf = new MemoryWritable()

    const writer = new CsvWriter(buf, {
      charset: windows31j ,
    })
    try {
      writer.write(["aaa", "b\"b\nb", "ccc"])
      writer.write(["あいう"])
    } finally {
      await writer.close()
    }

    expect(buf.toString("windows-31j")).toStrictEqual("aaa,\"b\"\"b\nb\",ccc\r\nあいう\r\n")
  })
})
