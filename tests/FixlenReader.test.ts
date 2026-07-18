import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { suite, test } from "node:test";
import { fileURLToPath } from "node:url";
import { cp939 } from "../src/charset/cp939.ts";
import { windows31j } from "../src/charset/windows31j.ts";
import { FixlenReader } from "../src/FixlenReader.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

suite("FixlenReader", () => {
  test("test read string", async () => {
    const reader = new FixlenReader("01234567890123456789", {
      lineLength: 10,
      columns: [{ start: 0 }, { start: 3, length: 3 }, { start: 7 }],
    });

    try {
      const list: (string | number)[][] = [];
      for await (const item of reader) {
        list.push(item);
      }
      assert.deepEqual(list, [
        ["012", "345", "789"],
        ["012", "345", "789"],
      ]);
    } finally {
      await reader.close();
    }
  });

  test("test read string with linebreak", async () => {
    const reader = new FixlenReader("0123456789\r\n0123456789\r\n", {
      lineLength: 12,
      columns: [{ start: 0 }, { start: 3, length: 3 }, { start: 7, length: 3 }],
    });

    try {
      const list: (string | number)[][] = [];
      for await (const item of reader) {
        list.push(item);
      }
      assert.deepEqual(list, [
        ["012", "345", "789"],
        ["012", "345", "789"],
      ]);
    } finally {
      await reader.close();
    }
  });

  test("test read shift_jis string with linebreak", async () => {
    const reader = new FixlenReader("0123４５６789\r\n0123４５６789\r\n", {
      lineLength: 15,
      columns: [
        { start: 0 },
        { start: 3, length: 5 },
        { start: 10, length: 3 },
      ],
      charset: windows31j,
    });

    try {
      const list: (string | number)[][] = [];
      for await (const item of reader) {
        list.push(item);
      }
      assert.deepEqual(list, [
        ["012", "3４５", "789"],
        ["012", "3４５", "789"],
      ]);
    } finally {
      await reader.close();
    }
  });

  test("test read mutiple layout shift_jis with linebreak", async () => {
    const columns1 = [{ start: 1, length: 10 }];
    const columns2 = [{ start: 1 }, { start: 6 }, { start: 11, length: 5 }];

    const fd = await fs.promises.open(
      `${__dirname}/data/FixlenReader.windows-31j.txt`,
    );
    const reader = new FixlenReader(fd, {
      lineLength: 18,
      columns(line) {
        const flag = line.decode({ start: 0, length: 1 });
        return flag === "1" ? columns1 : columns2;
      },
      charset: windows31j,
    });
    try {
      const list: (string | number)[][] = [];
      for await (const item of reader) {
        list.push(item);
      }
      assert.deepEqual(list, [["あいうえお"], ["ABCDE", "abcde", "01234"]]);
    } finally {
      await reader.close();
    }
  });

  test("test read cp938 old format with linebreak", async () => {
    const fd = await fs.promises.open(
      `${__dirname}/data/FixlenReader.cp939.txt`,
    );
    const reader = new FixlenReader(fd, {
      lineLength: 41,
      columns: [
        { start: 0, type: "decimal" },
        { start: 4, type: "decimal" },
        { start: 8, type: "int-le" },
        { start: 12, type: "int-be" },
        { start: 16, type: "uint-le" },
        { start: 20, type: "uint-be" },
        { start: 24, type: "zoned" },
        { start: 28, type: "uzoned" },
        { start: 32, type: "packed" },
        { start: 36, length: 4, type: "npacked" },
      ],
      charset: cp939,
    });
    try {
      const list: (string | number)[][] = [];
      for await (const item of reader) {
        list.push(item);
      }
      // biome-ignore format: data lines
      assert.deepEqual(list, [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [-2, -2, -2, -2, 4294967294, 4294967294, -2, 2, -2, 2],
        [341, 341, 341, 341, 341, 341, 341, 341, 341, 341],
        [-341, -341, -341, -341, 4294966955, 4294966955, -341, 341, -341, 341],
      ]);
    } finally {
      await reader.close();
    }
  });

  test("test read packed decimal variants", async () => {
    const reader = new FixlenReader(
      Uint8Array.of(
        0x00,
        0x00,
        0x34,
        0x1c,
        0x00,
        0x00,
        0x34,
        0x1f,
        0x12,
        0x34,
        0x56,
        0x78,
        0x00,
        0x00,
        0x34,
        0x1d,
        0x00,
        0x00,
        0x34,
        0x1f,
        0x12,
        0x34,
        0x56,
        0x78,
      ),
      {
        lineLength: 12,
        columns: [
          { start: 0, length: 4, type: "packed" },
          { start: 4, length: 4, type: "upacked" },
          { start: 8, length: 4, type: "npacked" },
        ],
      },
    );

    try {
      const list: (string | number)[][] = [];
      for await (const item of reader) {
        list.push(item);
      }
      assert.deepEqual(list, [
        [341, 341, 12345678],
        [-341, 341, 12345678],
      ]);
    } finally {
      await reader.close();
    }
  });

  test("test read separated zoned decimal variants", async () => {
    const reader = new FixlenReader(
      // biome-ignore format: data fields
      Uint8Array.of(
        0x4e, 0xf3, 0xf4, 0xf1,
        0xf3, 0xf4, 0xf1, 0x4e,
        0x60, 0xf3, 0xf4, 0xf1,
        0xf3, 0xf4, 0xf1, 0x60,
      ),
      {
        lineLength: 16,
        columns: [
          { start: 0, length: 4, type: "lzoned" },
          { start: 4, length: 4, type: "tzoned" },
          { start: 8, length: 4, type: "lzoned" },
          { start: 12, length: 4, type: "tzoned" },
        ],
        charset: cp939,
      },
    );

    try {
      assert.deepEqual(await reader.read(), [341, 341, -341, -341]);
    } finally {
      await reader.close();
    }
  });

  test("test read IEEE 754 floating-point variants", async () => {
    const reader = new FixlenReader(
      // biome-ignore format: data fields
      Uint8Array.of(
        0x3f, 0xc0, 0x00, 0x00,
        0x00, 0x00, 0xc0, 0x3f,
        0x3f, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf8, 0x3f,
      ),
      {
        lineLength: 24,
        columns: [
          { start: 0, length: 4, type: "float-be" },
          { start: 4, length: 4, type: "float-le" },
          { start: 8, length: 8, type: "float-be" },
          { start: 16, length: 8, type: "float-le" },
        ],
      },
    );

    try {
      assert.deepEqual(await reader.read(), [1.5, 1.5, 1.5, 1.5]);
    } finally {
      await reader.close();
    }
  });

  test("test reject unsupported floating-point length", async () => {
    const reader = new FixlenReader(Uint8Array.of(0x00, 0x00), {
      lineLength: 2,
      columns: [{ start: 0, type: "float-be" }],
      fatal: false,
    });

    try {
      await assert.rejects(reader.read(), /must be 4 or 8/);
    } finally {
      await reader.close();
    }
  });

  test("test reject invalid separated zoned sign", async () => {
    const reader = new FixlenReader(Uint8Array.of(0x40, 0xf1), {
      lineLength: 2,
      columns: [{ start: 0, type: "lzoned" }],
      charset: cp939,
    });

    try {
      await assert.rejects(reader.read(), /must be \+ or -/);
    } finally {
      await reader.close();
    }
  });

  test("test reject signed nibble for upacked", async () => {
    const reader = new FixlenReader(Uint8Array.of(0x1c), {
      lineLength: 1,
      columns: [{ start: 0, type: "upacked" }],
    });

    try {
      await assert.rejects(reader.read(), /upacked type must be F/);
    } finally {
      await reader.close();
    }
  });
});
