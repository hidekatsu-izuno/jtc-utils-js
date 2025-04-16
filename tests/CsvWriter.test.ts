import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { suite, test } from "node:test";
import { fileURLToPath } from "node:url";
import { CsvWriter } from "../src/CsvWriter.ts";
import { MemoryWritableStream } from "../src/MemoryWritableStream.ts";
import { utf16be } from "../src/charset/utf16be.ts";
import { utf16le } from "../src/charset/utf16le.ts";
import { windows31j } from "../src/charset/windows31j.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

suite("CsvWriter", () => {
  test("test write utf-8 csv with bom", async () => {
    const buf = new MemoryWritableStream();

    const writer = new CsvWriter(buf);
    try {
      await writer.write(["aaa", 'b"b\nb', "ccc"]);
      await writer.write(["あいう"]);
    } finally {
      await writer.close();
    }

    assert.equal(
      buf.toString("utf-8"),
      '\uFEFFaaa,"b""b\nb",ccc\r\nあいう\r\n',
    );
  });

  test("test write utf-8 csv without bom", async () => {
    const buf = new MemoryWritableStream();

    const writer = new CsvWriter(buf, {
      bom: false,
    });
    try {
      await writer.write(["aaa", 'b"b\nb', "ccc"]);
      await writer.write(["あいう"]);
    } finally {
      await writer.close();
    }

    assert.equal(buf.toString("utf-8"), 'aaa,"b""b\nb",ccc\r\nあいう\r\n');
  });

  test("test write windows-31j csv", async () => {
    const buf = new MemoryWritableStream();

    const writer = new CsvWriter(buf, {
      charset: windows31j,
    });
    let userDefined = "";
    for (let c = 0xe000; c <= 0xe757; c++) {
      userDefined += String.fromCharCode(c);
    }
    try {
      await writer.write(["aaa", 'b"b\nb', "ccc"]);
      await writer.write(["ΑΡΣΩαρσωАЯанояぁあんァヶ亜滌漾鵈０９ＡＺｧﾝｶﾞﾊﾟ"]);
      await writer.write([userDefined]);
    } finally {
      await writer.close();
    }

    assert.equal(
      buf.toString("windows-31j"),
      `aaa,"b""b\nb",ccc\r\nΑΡΣΩαρσωАЯанояぁあんァヶ亜滌漾鵈０９ＡＺｧﾝｶﾞﾊﾟ\r\n${userDefined}\r\n`,
    );
  });

  test("test write utf-16le csv", async () => {
    const buf = new MemoryWritableStream();

    const writer = new CsvWriter(buf, {
      charset: utf16le,
    });
    let userDefined = "";
    for (let c = 0xe000; c <= 0xe757; c++) {
      userDefined += String.fromCharCode(c);
    }
    try {
      await writer.write(["aaa", 'b"b\nb', "ccc"]);
      await writer.write(["ΑΡΣΩαρσωぁあんァヶ亜滌漾鵈０９ＡＺｧﾝｶﾞﾊﾟ"]);
      await writer.write([userDefined]);
    } finally {
      await writer.close();
    }

    assert.equal(
      buf.toString("utf-16le"),
      `\uFEFFaaa,"b""b\nb",ccc\r\nΑΡΣΩαρσωぁあんァヶ亜滌漾鵈０９ＡＺｧﾝｶﾞﾊﾟ\r\n${userDefined}\r\n`,
    );
  });

  test("test write utf-16be csv", async () => {
    const buf = new MemoryWritableStream();

    const writer = new CsvWriter(buf, {
      charset: utf16be,
    });
    let userDefined = "";
    for (let c = 0xe000; c <= 0xe757; c++) {
      userDefined += String.fromCharCode(c);
    }
    try {
      await writer.write(["aaa", 'b"b\nb', "ccc"]);
      await writer.write(["ΑΡΣΩαρσωぁあんァヶ亜滌漾鵈０９ＡＺｧﾝｶﾞﾊﾟ"]);
      await writer.write([userDefined]);
    } finally {
      await writer.close();
    }

    assert.equal(
      buf.toString("utf-16be"),
      `\uFEFFaaa,"b""b\nb",ccc\r\nΑΡΣΩαρσωぁあんァヶ亜滌漾鵈０９ＡＺｧﾝｶﾞﾊﾟ\r\n${userDefined}\r\n`,
    );
  });

  test("test write file", async () => {
    const filename = `${__dirname}/data/CsvWriter.utf-8.nobom.csv`;
    const fd = await fs.promises.open(filename, "w");
    const writer = new CsvWriter(fd, {
      bom: false,
    });

    try {
      await writer.write(["aaa", 'b"b\nb', "ccc"]);
      await writer.write(["あいう"]);
    } finally {
      await writer.close();
    }

    const buf = await fs.promises.readFile(filename);
    assert.equal(buf.toString("utf-8"), 'aaa,"b""b\nb",ccc\r\nあいう\r\n');

    await fs.promises.rm(filename);
  });
});
