import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { suite, test } from "node:test";
import { fileURLToPath } from "node:url";
import { CsvReader } from "../../src/CsvReader.ts";
import { cp943c } from "../../src/charset/cp943c.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readMap(name: string) {
  const map = new Map<number, number>();
  const reader = new CsvReader(
    fs.createReadStream(`${__dirname}/../../data/${name}`),
  );
  try {
    for await (const line of reader) {
      map.set(Number.parseInt(line[0], 16), Number.parseInt(line[1], 16));
    }
  } finally {
    await reader.close();
  }
  return map;
}

suite("cp943c", () => {
  test("compare cp943c decoder output", async () => {
    const map = await readMap("decode.cp943c.csv");
    const decoder = cp943c.createDecoder();

    for (let i = 0; i <= 0xffff; i++) {
      const input =
        i <= 0xff
          ? Uint8Array.of(i)
          : Uint8Array.of((i >>> 8) & 0xff, i & 0xff);
      const expected = map.get(i);

      let actual: number | undefined;
      try {
        const decoded = decoder.decode(input);
        actual = decoded.length === 1 ? decoded.charCodeAt(0) : undefined;
      } catch (_err) {
        // no handle
      }

      assert.deepEqual(
        [i.toString(16), actual?.toString(16)],
        [i.toString(16), expected?.toString(16)],
      );
    }
  });

  test("compare cp943c encoder output", async () => {
    const map = await readMap("encode.cp943c.csv");
    const encoder = cp943c.createEncoder();

    for (let i = 0; i <= 0xffff; i++) {
      const expected = map.get(i);
      let actual: number | undefined;

      try {
        const encoded = encoder.encode(String.fromCharCode(i));
        if (encoded.length === 1) {
          actual = encoded[0];
        } else if (encoded.length === 2) {
          actual = (encoded[0] << 8) | encoded[1];
        }
      } catch (_err) {
        // no handle
      }

      assert.deepEqual(
        [i.toString(16), actual?.toString(16)],
        [i.toString(16), expected?.toString(16)],
      );
    }
  });
});
