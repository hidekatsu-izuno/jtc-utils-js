import { describe, expect, test } from "vitest"

import { MemoryWritableStream } from "../src/MemoryWritableStream"
import { FixlenWriter } from "../src/FixlenWriter"

describe('FixlenWriter', () => {
  test("test write utf-8 fixlen without bom", async () => {
    const buf = new MemoryWritableStream()

    const writer = new FixlenWriter(buf)
    try {
      const layout = {
        lineLength: 10,
        columns: [{ length: 3 }, { length: 3 }, { length: 3 }, { length: 1 }]
      }
      await writer.write(["aaa", "bbb", "ccc"], layout)
      await writer.write(["ddd", "ee", "f"], layout)
    } finally {
      await writer.close()
    }

    expect(buf.toString("utf-8")).toStrictEqual("aaabbbccc dddee f   ")
  })

  test("test write utf-8 fixlen with bom", async () => {
    const buf = new MemoryWritableStream()

    const writer = new FixlenWriter(buf, {
      bom: true,
      lineSeparator: "\n"
    })
    try {
      const layout = {
        lineLength: 11,
        columns: [{ length: 3 }, { length: 3 }, { length: 3 }]
      }
      await writer.write(["aaa", "bbb", "ccc"], layout)
      await writer.write(["ddd", "eee", "fff"], layout)
    } finally {
      await writer.close()
    }

    expect(buf.toString("utf-8")).toStrictEqual("\uFEFFaaabbbccc \ndddeeefff \n")
  })
})
