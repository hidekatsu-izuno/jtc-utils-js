import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { suite, test } from "node:test";
import { fileURLToPath } from "node:url";
import { FixlenReader } from "../src/FixlenReader.ts";
import { windows31j } from "../src/charset/windows31j.ts";

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
});
