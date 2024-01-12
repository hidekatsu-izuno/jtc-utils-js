import { describe, expect, test } from "vitest"

import { MemoryWritableStream } from "../src/MemoryWritableStream"
import { FixlenWriter } from "../src/FixlenWriter"
import { windows31j } from "../src/charset/windows31j"
import { cp939 } from "../src/charset/cp939"
import fs from "node:fs"

describe("FixlenWriter", () => {
  test("test write utf-8 fixlen without bom", async () => {
    const buf = new MemoryWritableStream()
    const writer = new FixlenWriter(buf, {
      columns: [{ length: 3 }, { length: 3 }, { length: 3 }, { length: 1 }]
    })
    try {
      await writer.write(["aaa", "bbb", "ccc"])
      await writer.write(["ddd", "ee", "f"])
    } finally {
      await writer.close()
    }

    expect(buf.toString("utf-8")).toStrictEqual("aaabbbccc dddee f   ")
  })

  test("test write utf-8 fixlen with bom", async () => {
    const buf = new MemoryWritableStream()

    const writer = new FixlenWriter(buf, {
      columns: [{ length: 3 }, { length: 3 }, { length: 3 }],
      bom: true,
      lineSeparator: "\n"
    })
    try {
      await writer.write(["aaa", "bbb", "ccc"])
      await writer.write(["ddd", "eee", "fff"])
    } finally {
      await writer.close()
    }

    expect(buf.toString("utf-8")).toStrictEqual("\uFEFFaaabbbccc\ndddeeefff\n")
  })

  test("test write windows-31j fixlen", async () => {
    const buf = new MemoryWritableStream()

    const writer = new FixlenWriter(buf, {
      columns: [{ length: 3 }, { length: 4, filler: "　" }, { length: 6 }],
      charset: windows31j,
      lineSeparator: "\r\n"
    })
    try {
      await writer.write(["aaa", "あい", "ｶｶﾞﾊﾟ"])
      await writer.write(["dd", "あ", "ｱｲｳ"])
    } finally {
      await writer.close()
    }

    expect(buf.toString("windows-31j")).toStrictEqual("aaaあいｶｶﾞﾊﾟ \r\ndd あ　ｱｲｳ   \r\n")
  })

  test("test write cp939 fixlen", async () => {
    const buf = new MemoryWritableStream()

    const writer = new FixlenWriter(buf, {
      columns: [{ length: 3 }, { length: 4, filler: "　", shift: true }, { length: 6 }],
      charset: cp939,
      lineSeparator: "\r\n"
    })
    try {
      await writer.write(["aaa", "あい", "ｶｶﾞﾊﾟｬ"])
      await writer.write(["dd", "あ", "ｱｲｳ"])
    } finally {
      await writer.close()
    }

    expect(buf.toUint8Array()).toStrictEqual(Uint8Array.of(
      0x81, 0x81, 0x81, 0x44, 0x81, 0x44, 0x82, 0x66, 0x66, 0xBE, 0x9B, 0xBF, 0x54, 0x0D, 0x15,
      0x84, 0x84, 0x40, 0x44, 0x81, 0x40, 0x40, 0x59, 0x62, 0x63, 0x40, 0x40, 0x40, 0x0D, 0x15,
    ))
  })

  test("test write cp939 decimals fixlen", async () => {
    const buf = new MemoryWritableStream()

    const writer = new FixlenWriter(buf, {
      columns: [
        { length: 4 },
        { length: 4, type: "zerofill" },
        { length: 4, type: "int-le" },
        { length: 4, type: "int-be" },
        { length: 4, type: "uint-le" },
        { length: 4, type: "uint-be" },
        { length: 4, type: "zoned" },
        { length: 4, type: "packed" },
      ],
      charset: cp939,
      lineSeparator: "\n"
    })
    try {
      await writer.write([0, 0, 0, 0, 0, 0, 0, 0])
      await writer.write([341, 341, 341, 341, 341, 341, 341, 341])
      await writer.write([-341, -341, -341, -341, -341, -341, -341, -341])
    } finally {
      await writer.close()
    }

    expect(buf.toUint8Array()).toStrictEqual(Uint8Array.of(
      // line 1
      0x40, 0x40, 0x40, 0xF0, // default
      0xF0, 0xF0, 0xF0, 0xF0, // zerofill
      0x00, 0x00, 0x00, 0x00, // int-le
      0x00, 0x00, 0x00, 0x00, // int-be
      0x00, 0x00, 0x00, 0x00, // uint-le
      0x00, 0x00, 0x00, 0x00, // uint-be
      0xF0, 0xF0, 0xF0, 0xC0, // zoned
      0x00, 0x00, 0x00, 0x0C, // packed
      0x15,
      // line 2
      0x40, 0xF3, 0xF4, 0xF1, // default
      0xF0, 0xF3, 0xF4, 0xF1, // zerofill
      0x55, 0x01, 0x00, 0x00, // int-le
      0x00, 0x00, 0x01, 0x55, // int-be
      0x55, 0x01, 0x00, 0x00, // uint-le
      0x00, 0x00, 0x01, 0x55, // uint-be
      0xF0, 0xF3, 0xF4, 0xC1, // zoned
      0x00, 0x00, 0x34, 0x1C, // packed
      0x15,
      // line 3
      0x60, 0xF3, 0xF4, 0xF1, // default
      0x60, 0xF3, 0xF4, 0xF1, // zerofill
      0xAB, 0xFE, 0xFF, 0xFF, // int-le
      0xFF, 0xFF, 0xFE, 0xAB, // int-be
      0xAB, 0xFE, 0xFF, 0xFF, // uint-le
      0xFF, 0xFF, 0xFE, 0xAB, // uint-be
      0xF0, 0xF3, 0xF4, 0xD1, // zoned
      0x00, 0x00, 0x34, 0x1D, // packed
      0x15,
    ))
  })

  test("test write file", async () => {
    const filename = __dirname + "/data/FixlenWriter.windows-31j.txt"
    const fd = await fs.promises.open(filename, "w")
    const writer = new FixlenWriter(fd, {
      columns: [{ length: 3 }, { length: 4, filler: "　" }, { length: 6 }],
      charset: windows31j,
      lineSeparator: "\r\n"
    })
    try {
      await writer.write(["aaa", "あい", "ｶｶﾞﾊﾟ"])
      await writer.write(["dd", "あ", "ｱｲｳ"])
    } finally {
      await writer.close()
    }

    const buf = await fs.promises.readFile(filename)
    expect(new TextDecoder("windows-31j").decode(buf)).toStrictEqual("aaaあいｶｶﾞﾊﾟ \r\ndd あ　ｱｲｳ   \r\n")

    await fs.promises.rm(filename)
  })
})
