import assert from "node:assert/strict";
import fs from "node:fs";
import { suite, test } from "node:test";
import { CsvReader } from "../../src/CsvReader.ts";
import { cp942, cp942c } from "../../src/charset/index.ts";

async function readMap(name: string) {
  const map = new Map<number, number>();
  const reader = new CsvReader(
    fs.createReadStream(new URL(`../../data/${name}`, import.meta.url)),
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

for (const charset of [cp942, cp942c]) {
  suite(charset.name, () => {
    test("compare every BMP encoder input and canEncode with Java", async () => {
      const map = await readMap(`encode.${charset.name}.csv`);
      const encoder = charset.createEncoder();
      for (let cp = 0; cp <= 0xffff; cp++) {
        const str = String.fromCharCode(cp);
        const expected = map.get(cp);
        assert.equal(encoder.canEncode(str), expected != null, cp.toString(16));
        if (expected == null) {
          assert.throws(() => encoder.encode(str), TypeError, cp.toString(16));
        } else {
          assert.deepEqual(
            encoder.encode(str),
            expected <= 0xff
              ? Uint8Array.of(expected)
              : Uint8Array.of(expected >>> 8, expected & 0xff),
            cp.toString(16),
          );
        }
      }
    });

    test("compare every one- and two-byte decoder input with Java", async () => {
      const map = await readMap(`decode.${charset.name}.csv`);
      const decoder = charset.createDecoder();
      for (let length = 1; length <= 2; length++) {
        for (let code = 0; code <= (length === 1 ? 0xff : 0xffff); code++) {
          const bytes =
            length === 1
              ? Uint8Array.of(code)
              : Uint8Array.of(code >>> 8, code & 0xff);
          // A leading zero in a two-byte input is a separate NUL character.
          const expected =
            length === 2 && code <= 0xff ? undefined : map.get(code);
          let actual: number | undefined;
          try {
            const decoded = decoder.decode(bytes);
            actual = decoded.length === 1 ? decoded.charCodeAt(0) : undefined;
          } catch (error) {
            assert.ok(error instanceof TypeError);
          }
          assert.equal(actual, expected, `${length}:${code.toString(16)}`);
        }
      }
    });

    test("streaming preserves split characters and flushes incomplete input", () => {
      const encoder = charset.createEncoder();
      const str = "日本語\\~\u001a\u001c\u007f¢£¬堯髙\ue000";
      const bytes = encoder.encode(str);
      const expected = charset.createDecoder().decode(bytes);
      for (let split = 0; split <= bytes.length; split++) {
        const decoder = charset.createDecoder();
        assert.equal(
          decoder.decode(bytes.subarray(0, split), { stream: true }) +
            decoder.decode(bytes.subarray(split)),
          expected,
        );
      }
      const decoder = charset.createDecoder();
      assert.equal(decoder.decode(Uint8Array.of(0x81), { stream: true }), "");
      assert.equal(decoder.decode(new Uint8Array(), { stream: true }), "");
      assert.throws(() => decoder.decode(new Uint8Array()), TypeError);
      assert.equal(decoder.decode(Uint8Array.of(0x41)), "A");
    });

    test("fatal and replacement behavior", () => {
      for (const bytes of [
        Uint8Array.of(0x81),
        Uint8Array.of(0x81, 0xca),
        Uint8Array.of(0x87, 0x40),
        Uint8Array.of(0xed, 0x40),
      ]) {
        assert.throws(() => charset.createDecoder().decode(bytes), TypeError);
        assert.equal(
          charset.createDecoder({ fatal: false }).decode(bytes),
          "\ufffd",
        );
      }
      assert.equal(
        charset
          .createDecoder({ fatal: false })
          .decode(Uint8Array.of(0x81, 0x20)),
        "\ufffd ",
      );
      assert.equal(charset.createEncoder().canEncode("A①😀"), false);
      assert.throws(() => charset.createEncoder().encode("①"), TypeError);
      assert.deepEqual(
        charset.createEncoder({ fatal: false }).encode("①☃"),
        Uint8Array.of(0x5f, 0x5f),
      );
    });

    test("limits stop at the first character that does not fit", () => {
      const encoder = charset.createEncoder();
      for (const str of ["A堯B", "A日B", "\\~A"]) {
        for (let limit = 0; limit <= 6; limit++) {
          const expected: number[] = [];
          for (const char of str) {
            const bytes = encoder.encode(char);
            if (expected.length + bytes.length > limit) break;
            expected.push(...bytes);
          }
          assert.deepEqual(
            encoder.encode(str, { limit }),
            Uint8Array.from(expected),
          );
        }
      }
    });

    test("large input and charset metadata", () => {
      const str = "A堯".repeat(100_000);
      assert.equal(
        charset.createDecoder().decode(charset.createEncoder().encode(str)),
        str,
      );
      assert.equal(charset.isUnicode(), false);
      assert.equal(charset.isEbcdic(), false);
    });
  });
}

test("CP942C restores ASCII controls, backslash and tilde", () => {
  const bytes = Uint8Array.of(0x1a, 0x1c, 0x7f, 0x5c, 0x7e, 0xfe, 0xff);
  assert.equal(cp942.createDecoder().decode(bytes), "\u001c\u007f\u001a¥‾\\~");
  assert.equal(
    cp942c.createDecoder().decode(bytes),
    "\u001a\u001c\u007f\\~\\~",
  );
});
