import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { suite, test } from "node:test";
import { fileURLToPath } from "node:url";
import { CsvReader } from "../../src/CsvReader.ts";
import { windows31j } from "../../src/charset/windows31j.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

suite("windows31j", () => {
  test("compare windows-31j encoder output", async () => {
    const map = new Map();
    const reader = new CsvReader(
      fs.createReadStream(`${__dirname}/../../data/encode.windows-31j.csv`),
    );
    try {
      for await (const line of reader) {
        map.set(Number.parseInt(line[0], 16), Number.parseInt(line[1], 16));
      }
    } finally {
      await reader.close();
    }

    const encoder = windows31j.createEncoder();
    for (let i = 0; i < 65536; i++) {
      const c = String.fromCharCode(i);
      const expected = map.get(i);

      let actual: number | undefined = undefined;
      try {
        const oc = encoder.encode(String.fromCharCode(i));
        actual =
          oc.length === 4
            ? (oc[0] << 24) | (oc[1] << 16) | (oc[2] << 8) | oc[3]
            : oc.length === 3
              ? (oc[0] << 16) | (oc[1] << 8) | oc[2]
              : oc.length === 2
                ? (oc[0] << 8) | oc[1]
                : oc[0];
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
