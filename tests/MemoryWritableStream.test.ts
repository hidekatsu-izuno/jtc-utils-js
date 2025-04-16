import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { MemoryWritableStream } from "../src/MemoryWritableStream.ts";

suite("MemoryWritableStream", () => {
  test("test writable stream", async () => {
    const stream = new MemoryWritableStream();

    const out = stream.getWriter();
    await out.write(Buffer.from("abc"));
    await out.write(Buffer.from("def"));
    await out.close();

    assert.equal(stream.toString("utf-8"), "abcdef");
  });
});
