import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { suite, test } from "node:test";
import { fileURLToPath } from "node:url";
import { FixlenReader } from "../src/FixlenReader.ts";
import { windows31j } from "../src/charset/windows31j.ts";
import { cp939 } from "../src/charset/cp939.ts"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

suite("FixlenReader", () => {
  test("test read string", async () => {
    const reader = new FixlenReader("01234567890123456789", {
      lineLength: 10,
      columns: [{ start: 0 }, { start: 3, length: 3 }, { start: 7 }],
    });

    try {
      const list = new Array<(string | number)[]>();
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
      const list = new Array<(string | number)[]>();
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
      const list = new Array<(string | number)[]>();
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
      const list = new Array<(string | number)[]>();
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
        { start: 36, length: 4, type: "upacked" },
      ],
      charset: cp939,
    });
    try {
      const list = new Array<(string | number)[]>();
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
});
