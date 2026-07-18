import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { suite, test } from "node:test";
import { fileURLToPath } from "node:url";
import { xFujitsuEbcdicAscii } from "../../src/charset/xFujitsuEbcdicAscii.ts";
import { xFujitsuEbcdicKana } from "../../src/charset/xFujitsuEbcdicKana.ts";
import { xFujitsuEbcdicLower } from "../../src/charset/xFujitsuEbcdicLower.ts";
import { xFujitsuJef } from "../../src/charset/xFujitsuJef.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.join(__dirname, "../../data");

suite("Fujitsu EBCDIC", () => {
  for (const [type, charset] of [
    ["ascii", xFujitsuEbcdicAscii],
    ["kana", xFujitsuEbcdicKana],
    ["lower", xFujitsuEbcdicLower],
  ] as const) {
    test(`${type} decoder matches mapping data`, () => {
      const expected = readNumericMap(`decode.x-fujitsu-ebcdic-${type}.csv`);
      const decoder = charset.createDecoder();

      for (let code = 0; code <= 0xff; code++) {
        let actual: number | undefined;
        try {
          actual = decoder.decode(Uint8Array.of(code)).charCodeAt(0);
        } catch (_error) {
          // Unmapped byte.
        }
        assert.equal(actual, expected.get(code), code.toString(16));
      }
    });

    test(`${type} encoder matches mapping data`, () => {
      const expected = readNumericMap(`encode.x-fujitsu-ebcdic-${type}.csv`);
      const encoder = charset.createEncoder();

      for (let unicode = 0; unicode <= 0xffff; unicode++) {
        const str = String.fromCharCode(unicode);
        const code = expected.get(unicode);
        assert.equal(
          encoder.canEncode(str),
          code != null,
          unicode.toString(16),
        );
        if (code != null) {
          assert.deepEqual(
            encoder.encode(str),
            Uint8Array.of(code),
            unicode.toString(16),
          );
        }
      }
    });
  }

  test("options and metadata", () => {
    assert.equal(xFujitsuEbcdicAscii.name, "x-fujitsu-ebcdic-ascii");
    assert.equal(xFujitsuEbcdicKana.name, "x-fujitsu-ebcdic-kana");
    assert.equal(xFujitsuEbcdicLower.name, "x-fujitsu-ebcdic-lower");
    assert.equal(xFujitsuEbcdicAscii.isEbcdic(), true);
    assert.deepEqual(
      xFujitsuEbcdicAscii
        .createEncoder({ fatal: false })
        .encode("🙂", { limit: 1 }),
      Uint8Array.of(0x6f),
    );
    assert.equal(
      xFujitsuEbcdicAscii
        .createDecoder({ fatal: false })
        .decode(Uint8Array.of(0x41)),
      "\ufffd",
    );
  });
});

suite("Fujitsu JEF", () => {
  test("decoder matches mapping data", () => {
    const decoder = xFujitsuJef.createDecoder();
    for (const [code, unicode] of readRows("decode.x-fujitsu-jef.csv")) {
      assert.equal(
        decoder.decode(Uint8Array.of(code >>> 8, code & 0xff)),
        unicode,
        code.toString(16),
      );
    }
  });

  test("encoder matches mapping data", () => {
    const encoder = xFujitsuJef.createEncoder();
    for (const [code, unicode] of readRows("encode.x-fujitsu-jef.csv", true)) {
      assert.equal(encoder.canEncode(unicode), true, unicode);
      assert.deepEqual(
        encoder.encode(unicode),
        Uint8Array.of(code >>> 8, code & 0xff),
        unicode,
      );
    }
  });

  test("user-defined characters, streaming, and options", () => {
    const decoder = xFujitsuJef.createDecoder();
    assert.equal(decoder.decode(Uint8Array.of(0xa4), { stream: true }), "");
    assert.equal(decoder.decode(Uint8Array.of(0xa2)), "あ");
    assert.equal(
      decoder.decode(Uint8Array.of(0x80, 0xa1, 0xa0, 0xfe)),
      "\ue000\uec1d",
    );

    const encoder = xFujitsuJef.createEncoder();
    assert.equal(encoder.canEncode("\ue000\uec1d"), true);
    assert.deepEqual(
      encoder.encode("\ue000\uec1d"),
      Uint8Array.of(0x80, 0xa1, 0xa0, 0xfe),
    );
    assert.deepEqual(
      encoder.encode("あ海", { limit: 3 }),
      Uint8Array.of(0xa4, 0xa2),
    );
    assert.deepEqual(
      xFujitsuJef.createEncoder({ fatal: false }).encode("a"),
      Uint8Array.of(0x40, 0x40),
    );
    assert.equal(
      xFujitsuJef
        .createDecoder({ fatal: false })
        .decode(Uint8Array.of(0x00, 0x00)),
      "\ufffd",
    );
    assert.equal(xFujitsuJef.name, "x-fujitsu-jef");
    assert.equal(xFujitsuJef.isEbcdic(), true);
  });
});

function readNumericMap(name: string) {
  return new Map(
    fs
      .readFileSync(path.join(dataDirectory, name), "utf8")
      .trimEnd()
      .split("\n")
      .map((line) => {
        const [from, to] = line.split(",", 2);
        return [Number.parseInt(from, 16), Number.parseInt(to, 16)] as const;
      }),
  );
}

function readRows(name: string, encode = false) {
  return fs
    .readFileSync(path.join(dataDirectory, name), "utf8")
    .trimEnd()
    .split("\n")
    .map((line) => {
      const [from, to] = line.split(",", 2);
      const unicode = (encode ? from : to)
        .split("+")
        .map((value) => String.fromCodePoint(Number.parseInt(value, 16)))
        .join("");
      const code = Number.parseInt(encode ? to : from, 16);
      return [code, unicode] as const;
    });
}
