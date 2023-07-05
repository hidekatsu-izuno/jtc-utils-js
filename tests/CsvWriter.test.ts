import { describe, expect, test } from "vitest"

import { MemoryWritableStream } from "../src/MemoryWritableStream.js"
import { CsvWriter } from "../src/CsvWriter.js"
import { windows31j } from "../src/charset/windows31j.js"
import { utf16le } from "../src/charset/utf16le.js"
import { utf16be } from "../src/charset/utf16be.js"

describe('CsvWriter', () => {
  test("test write utf-8 csv with bom", async () => {
    const buf = new MemoryWritableStream()

    const writer = new CsvWriter(buf)
    try {
      await writer.write(["aaa", "b\"b\nb", "ccc"])
      await writer.write(["あいう"])
    } finally {
      await writer.close()
    }

    expect(buf.toString("utf-8")).toStrictEqual("\uFEFFaaa,\"b\"\"b\nb\",ccc\r\nあいう\r\n")
  })

  test("test write utf-8 csv without bom", async () => {
    const buf = new MemoryWritableStream()

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
    const buf = new MemoryWritableStream()

    const writer = new CsvWriter(buf, {
      charset: windows31j,
    })
    let userDefined = ""
    for (let c = 0xE000; c <= 0xE757; c++) {
      userDefined += String.fromCharCode(c)
    }
    try {
      writer.write(["aaa", "b\"b\nb", "ccc"])
      writer.write(["ΑΡΣΩαρσωАЯанояぁあんァヶ亜滌漾鵈０９ＡＺｧﾝｶﾞﾊﾟ"])
      writer.write([userDefined])

    } finally {
      await writer.close()
    }

    expect(buf.toString("windows-31j")).toStrictEqual("aaa,\"b\"\"b\nb\",ccc\r\nΑΡΣΩαρσωАЯанояぁあんァヶ亜滌漾鵈０９ＡＺｧﾝｶﾞﾊﾟ\r\n" + userDefined + "\r\n")
  })

  test("test write utf-16le csv", async () => {
    const buf = new MemoryWritableStream()

    const writer = new CsvWriter(buf, {
      charset: utf16le,
    })
    let userDefined = ""
    for (let c = 0xE000; c <= 0xE757; c++) {
      userDefined += String.fromCharCode(c)
    }
    try {
      writer.write(["aaa", "b\"b\nb", "ccc"])
      writer.write(["ΑΡΣΩαρσωぁあんァヶ亜滌漾鵈０９ＡＺｧﾝｶﾞﾊﾟ"])
      writer.write([userDefined])

    } finally {
      await writer.close()
    }

    expect(buf.toString("utf-16le")).toStrictEqual("\uFEFFaaa,\"b\"\"b\nb\",ccc\r\nΑΡΣΩαρσωぁあんァヶ亜滌漾鵈０９ＡＺｧﾝｶﾞﾊﾟ\r\n" + userDefined + "\r\n")
  })

  test("test write utf-16be csv", async () => {
    const buf = new MemoryWritableStream()

    const writer = new CsvWriter(buf, {
      charset: utf16be,
    })
    let userDefined = ""
    for (let c = 0xE000; c <= 0xE757; c++) {
      userDefined += String.fromCharCode(c)
    }
    try {
      writer.write(["aaa", "b\"b\nb", "ccc"])
      writer.write(["ΑΡΣΩαρσωぁあんァヶ亜滌漾鵈０９ＡＺｧﾝｶﾞﾊﾟ"])
      writer.write([userDefined])

    } finally {
      await writer.close()
    }

    expect(buf.toString("utf-16be")).toStrictEqual("\uFEFFaaa,\"b\"\"b\nb\",ccc\r\nΑΡΣΩαρσωぁあんァヶ亜滌漾鵈０９ＡＺｧﾝｶﾞﾊﾟ\r\n" + userDefined + "\r\n")
  })
})
