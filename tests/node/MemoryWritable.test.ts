import { describe, expect, test } from "vitest"
import { MemoryWritable } from "../../src/node/MemoryWritable"

describe('MemoryWritableStream', () => {
  test("test writable stream", async () => {
    const stream = new MemoryWritable()
    stream.write(Buffer.from("abc"))
    stream.write(Buffer.from("def"))
    await new Promise(resolve => stream.end(resolve))

    expect(stream.toString("utf-8")).toStrictEqual("abcdef")
  })
})
