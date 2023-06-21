import { describe, expect, test } from "vitest"
import { MemoryWritableStream } from "../src/MemoryWritableStream"

describe('MemoryWritableStream', () => {
  test("test writable stream", async () => {
    const stream = new MemoryWritableStream()

    const out = stream.getWriter()
    await out.write(Buffer.from("abc"))
    await out.write(Buffer.from("def"))
    await out.close()

    expect(stream.toString("utf-8")).toStrictEqual("abcdef")
  })
})
