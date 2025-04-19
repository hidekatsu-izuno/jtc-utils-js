import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { suite, test } from "node:test";
import { fileURLToPath } from "node:url";
import { FixlenWriter } from "../src/FixlenWriter.ts";
import { MemoryWritableStream } from "../src/MemoryWritableStream.ts";
import { cp939 } from "../src/charset/cp939.ts";
import { windows31j } from "../src/charset/windows31j.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

suite("FixlenWriter", () => {
  test("test write utf-8 fixlen without bom", async () => {
    const buf = new MemoryWritableStream();
    const writer = new FixlenWriter(buf, {
      columns: [{ length: 3 }, { length: 3 }, { length: 3 }, { length: 1 }],
    });
    try {
      await writer.write(["aaa", "bbb", "ccc"]);
      await writer.write(["ddd", "ee", "f"]);
    } finally {
      await writer.close();
    }

    assert.equal(buf.toString("utf-8"), "aaabbbccc dddee f   ");
  });

  test("test write utf-8 fixlen with bom", async () => {
    const buf = new MemoryWritableStream();

    const writer = new FixlenWriter(buf, {
      columns: [{ length: 3 }, { length: 3 }, { length: 3 }],
      bom: true,
      lineSeparator: "\n",
    });
    try {
      await writer.write(["aaa", "bbb", "ccc"]);
      await writer.write(["ddd", "eee", "fff"]);
    } finally {
      await writer.close();
    }

    assert.equal(buf.toString("utf-8"), "\uFEFFaaabbbccc\ndddeeefff\n");
  });

  test("test write windows-31j fixlen", async () => {
    const buf = new MemoryWritableStream();

    const writer = new FixlenWriter(buf, {
      columns: [{ length: 3 }, { length: 4, filler: "　" }, { length: 6 }],
      charset: windows31j,
      lineSeparator: "\r\n",
    });
    try {
      await writer.write(["aaa", "あい", "ｶｶﾞﾊﾟ"]);
      await writer.write(["dd", "あ", "ｱｲｳ"]);
    } finally {
      await writer.close();
    }

    assert.equal(
      buf.toString("windows-31j"),
      "aaaあいｶｶﾞﾊﾟ \r\ndd あ　ｱｲｳ   \r\n",
    );
  });

  test("test write cp939 fixlen", async () => {
    const buf = new MemoryWritableStream();

    const writer = new FixlenWriter(buf, {
      columns: [
        { length: 3 },
        { length: 4, filler: "　", shift: true },
        { length: 6 },
      ],
      charset: cp939,
      lineSeparator: "\r\n",
    });
    try {
      await writer.write(["aaa", "あい", "ｶｶﾞﾊﾟｬ"]);
      await writer.write(["dd", "あ", "ｱｲｳ"]);
    } finally {
      await writer.close();
    }

    assert.deepEqual(
      buf.toUint8Array(),
      // biome-ignore format: data lines
      Uint8Array.of(
        // [line 1]
        0x81, 0x81, 0x81, 
        0x44, 0x81, 0x44, 0x82, 
        0x66, 0x66, 0xbe, 0x9b, 0xbf, 0x54,
        0x0d, 0x15,
        // [line 2]
        0x84, 0x84, 0x40, 
        0x44, 0x81, 0x40, 0x40,
        0x59, 0x62, 0x63, 0x40, 0x40, 0x40,
        0x0d, 0x15,
      ),
    );
  });

  test("test write cp939 decimals fixlen", async () => {
    const buf = new MemoryWritableStream();
    const writer = new FixlenWriter(buf, {
      columns: [
        { length: 4 },
        { length: 4, type: "zerofill" },
        { length: 4, type: "int-le" },
        { length: 4, type: "int-be" },
        { length: 4, type: "uint-le" },
        { length: 4, type: "uint-be" },
        { length: 4, type: "zoned" },
        { length: 4, type: "uzoned" },
        { length: 4, type: "packed" },
        { length: 4, type: "upacked" },
      ],
      charset: cp939,
      lineSeparator: "\n",
      fatal: false,
    });
    // biome-ignore format: data lines
    try {
      await writer.write([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      await writer.write([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
      await writer.write([-2, -2, -2, -2, -2, -2, -2, -2, -2, -2]);
      await writer.write([341, 341, 341, 341, 341, 341, 341, 341, 341, 341]);
      await writer.write([-341, -341, -341, -341, -341, -341, -341, -341, -341, -341]);
    } finally {
      await writer.close();
    }

    assert.deepEqual(
      buf.toUint8Array(),
      // biome-ignore format: data lines
      Uint8Array.of(
        // [line 1]
        0x40, 0x40, 0x40, 0xf0, // default
        0xf0, 0xf0, 0xf0, 0xf0, // zerofill
        0x00, 0x00, 0x00, 0x00, // int-le
        0x00, 0x00, 0x00, 0x00, // int-be
        0x00, 0x00, 0x00, 0x00, // uint-le
        0x00, 0x00, 0x00, 0x00, // uint-be
        0xf0, 0xf0, 0xf0, 0xc0, // zoned
        0xf0, 0xf0, 0xf0, 0xf0, // uzoned
        0x00, 0x00, 0x00, 0x0c, // packed
        0x00, 0x00, 0x00, 0x00, // upacked
        0x15, // LF
        // [line 2]
        0x40, 0x40, 0x40, 0xf1, // default
        0xf0, 0xf0, 0xf0, 0xf1, // zerofill
        0x01, 0x00, 0x00, 0x00, // int-le
        0x00, 0x00, 0x00, 0x01, // int-be
        0x01, 0x00, 0x00, 0x00, // uint-le
        0x00, 0x00, 0x00, 0x01, // uint-be
        0xf0, 0xf0, 0xf0, 0xc1, // zoned
        0xf0, 0xf0, 0xf0, 0xf1, // uzoned
        0x00, 0x00, 0x00, 0x1c, // packed
        0x00, 0x00, 0x00, 0x01, // upacked
        0x15, // LF
        // [line 3]
        0x40, 0x40, 0x60, 0xf2, // default
        0x60, 0xf0, 0xf0, 0xf2, // zerofill
        0xfe, 0xff, 0xff, 0xff, // int-le
        0xff, 0xff, 0xff, 0xfe, // int-be
        0xfe, 0xff, 0xff, 0xff, // uint-le
        0xff, 0xff, 0xff, 0xfe, // uint-be
        0xf0, 0xf0, 0xf0, 0xd2, // zoned
        0xf0, 0xf0, 0xf0, 0xf2, // uzoned
        0x00, 0x00, 0x00, 0x2d, // packed
        0x00, 0x00, 0x00, 0x02, // upacked
        0x15, // LF
        // line 3
        0x40, 0xf3, 0xf4, 0xf1, // default
        0xf0, 0xf3, 0xf4, 0xf1, // zerofill
        0x55, 0x01, 0x00, 0x00, // int-le
        0x00, 0x00, 0x01, 0x55, // int-be
        0x55, 0x01, 0x00, 0x00, // uint-le
        0x00, 0x00, 0x01, 0x55, // uint-be
        0xf0, 0xf3, 0xf4, 0xc1, // zoned
        0xf0, 0xf3, 0xf4, 0xf1, // uzoned
        0x00, 0x00, 0x34, 0x1c, // packed
        0x00, 0x00, 0x03, 0x41, // upacked
        0x15,
        // line 4
        0x60, 0xf3, 0xf4, 0xf1, // default
        0x60, 0xf3, 0xf4, 0xf1, // zerofill
        0xab, 0xfe, 0xff, 0xff, // int-le
        0xff, 0xff, 0xfe, 0xab, // int-be
        0xab, 0xfe, 0xff, 0xff, // uint-le
        0xff, 0xff, 0xfe, 0xab, // uint-be
        0xf0, 0xf3, 0xf4, 0xd1, // zoned
        0xf0, 0xf3, 0xf4, 0xf1, // uzoned
        0x00, 0x00, 0x34, 0x1d, // packed
        0x00, 0x00, 0x03, 0x41, // upacked
        0x15,

      ),
    );
  });

  test("test write file", async () => {
    const filename = `${__dirname}/data/FixlenWriter.windows-31j.txt`;
    const fd = await fs.promises.open(filename, "w");
    const writer = new FixlenWriter(fd, {
      columns: [{ length: 3 }, { length: 4, filler: "　" }, { length: 6 }],
      charset: windows31j,
      lineSeparator: "\r\n",
    });
    try {
      await writer.write(["aaa", "あい", "ｶｶﾞﾊﾟ"]);
      await writer.write(["dd", "あ", "ｱｲｳ"]);
    } finally {
      await writer.close();
    }

    const buf = await fs.promises.readFile(filename);
    assert.equal(
      new TextDecoder("windows-31j").decode(buf),
      "aaaあいｶｶﾞﾊﾟ \r\ndd あ　ｱｲｳ   \r\n",
    );

    await fs.promises.rm(filename);
  });
});
