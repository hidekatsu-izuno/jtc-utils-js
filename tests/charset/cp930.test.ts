import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { suite, test } from "node:test";
import { fileURLToPath } from "node:url";
import { CsvReader } from "../../src/CsvReader.ts";
import { cp930 } from "../../src/charset/cp930.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

suite("cp930", () => {
  test("compare cp930 decoder output", async () => {
    const map = new Map<number, number>();
    const reader = new CsvReader(
      fs.createReadStream(`${__dirname}/../../data/decode.cp930.csv`),
    );
    try {
      for await (const line of reader) {
        map.set(Number.parseInt(line[0], 16), Number.parseInt(line[1], 16));
      }
    } finally {
      await reader.close();
    }

    const decoder = cp930.createDecoder();
    for (let i = 0x00; i <= 0xff; i++) {
      const expected = map.get(i);

      let actual: number | undefined;
      try {
        const enc = decoder.decode(Uint8Array.of(i));
        actual = enc.length === 1 ? enc.charCodeAt(0) : undefined;
      } catch (err) {
        // no handle
      }
      assert.deepEqual(
        [i.toString(16), actual?.toString(16)],
        [i.toString(16), expected?.toString(16)],
      );
    }

    for (let i = 0x4040; i <= 0xffff; i++) {
      const expected = map.get(i);

      let actual: number | undefined;
      try {
        const enc = decoder.decode(
          Uint8Array.of(0x0e, (i >>> 8) & 0xff, i & 0xff, 0x0f),
        );
        actual = enc.length === 1 ? enc.charCodeAt(0) : undefined;
      } catch (err) {
        // no handle
      }
      assert.deepEqual(
        [i.toString(16), actual?.toString(16)],
        [i.toString(16), expected?.toString(16)],
      );
    }
  });

  test("compare cp930 encoder output", async () => {
    const map = new Map();
    const reader = new CsvReader(
      fs.createReadStream(`${__dirname}/../../data/encode.cp930.csv`),
    );
    try {
      for await (const line of reader) {
        map.set(Number.parseInt(line[0], 16), Number.parseInt(line[1], 16));
      }
    } finally {
      await reader.close();
    }

    const encoder = cp930.createEncoder();
    for (let i = 0; i < 65536; i++) {
      const c = String.fromCharCode(i);
      const expected = map.get(i);

      let actual: number | undefined = undefined;
      try {
        const enc = encoder.encode(c);
        if (enc.length === 4 && enc[0] === 0x0e && enc[3] === 0x0f) {
          actual = (enc[1] << 8) | enc[2];
        } else if (enc.length === 1) {
          actual = enc[0];
        } else if (enc.length > 0) {
          actual = enc.length === 2 ? (enc[0] << 8) | enc[1] : enc[0];
        }
      } catch (err) {
        // no handle
      }

      assert.deepEqual(
        [i.toString(16), c, actual?.toString(16)],
        [i.toString(16), c, expected?.toString(16)],
      );
    }
  });
});
