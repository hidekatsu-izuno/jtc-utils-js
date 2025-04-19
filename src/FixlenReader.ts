import type { FileHandle } from "node:fs/promises";
import type { Readable } from "node:stream";
import type { Charset, CharsetDecoder } from "./charset/charset.ts";
import { utf8 } from "./charset/utf8.ts";

export declare type FixlenReaderColumn = {
  start: number;
  length?: number;
  shift?: boolean;
  trim?: "left" | "right" | "both";
  type?:
    | "decimal"
    | "int-le"
    | "int-be"
    | "uint-le"
    | "uint-be"
    | "zoned"
    | "uzoned"
    | "packed"
    | "upacked";
};

export interface FixlenLineDecoder {
  decode(column: FixlenReaderColumn): string | number;
}

export class FixlenReader {
  private reader: Promise<ReadableStreamDefaultReader<Uint8Array>>;
  private decoder: CharsetDecoder;
  private lineLength: number;
  private columns:
    | (FixlenReaderColumn & { end: number })[]
    | ((line: FixlenLineDecoder) => FixlenReaderColumn[]);
  private shift: boolean;
  private fatal: boolean;

  private buf = new Uint8Array();

  private index = 0;

  constructor(
    src:
      | string
      | Uint8Array
      | Blob
      | ReadableStream<Uint8Array>
      | FileHandle
      | Readable,
    config: {
      lineLength: number;
      columns:
        | FixlenReaderColumn[]
        | ((line: FixlenLineDecoder) => FixlenReaderColumn[]);
      charset?: Charset;
      bom?: boolean;
      shift?: boolean;
      fatal?: boolean;
    },
  ) {
    const charset = config.charset ?? utf8;
    this.fatal = config.fatal ?? true;
    this.shift = config.shift ?? false;
    this.lineLength = config.lineLength;
    this.columns = Array.isArray(config.columns)
      ? this.normalizeColumns(this.lineLength, config.columns, this.shift)
      : config.columns;

    let stream: Promise<ReadableStream<Uint8Array>>;
    if (typeof src === "string") {
      stream = Promise.resolve(
        new ReadableStream<Uint8Array>({
          start(controller) {
            const encoder = charset.createEncoder();
            controller.enqueue(encoder.encode(src));
            controller.close();
          },
        }),
      );
    } else if (src instanceof Uint8Array) {
      stream = Promise.resolve(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(src);
            controller.close();
          },
        }),
      );
    } else if (src instanceof Blob) {
      stream = Promise.resolve(src.stream());
    } else if (src instanceof ReadableStream) {
      stream = Promise.resolve(src);
    } else {
      const readable = "createReadStream" in src ? src.createReadStream() : src;
      if (
        "constructor" in readable &&
        "toWeb" in readable.constructor &&
        typeof readable.constructor.toWeb === "function"
      ) {
        stream = Promise.resolve(readable.constructor.toWeb(readable));
      } else {
        throw new TypeError(`Unsuppoted source: ${src}`);
      }
    }

    this.decoder = charset.createDecoder({
      fatal: this.fatal,
      ignoreBOM: config.bom != null ? !config.bom : false,
    });
    this.reader = stream.then((value) => value.getReader());
  }

  async read(options?: {
    lineLength: number;
    columns:
      | FixlenReaderColumn[]
      | ((line: FixlenLineDecoder) => FixlenReaderColumn[]);
    shift?: boolean;
  }): Promise<(string | number)[] | undefined> {
    const items = new Array<string | number>();

    const lineLength = options?.lineLength ?? this.lineLength;
    const shift = options?.shift ?? this.shift;

    let done = false;
    let buf = this.buf;
    const reader = await this.reader;
    do {
      const readed = await reader.read();
      done = readed.done;
      if (readed.value) {
        buf = buf.length > 0 ? this.concat(buf, readed.value) : readed.value;
      }
    } while (!done && buf.length < lineLength);

    let line: Uint8Array;
    if (buf.length === 0) {
      this.buf = buf;
      return;
    } else if (buf.length < lineLength) {
      if (this.fatal) {
        throw new TypeError("Insufficient data.");
      }
      line = buf;
      this.buf = buf.subarray(buf.length);
    } else {
      line = buf.subarray(0, lineLength);
      this.buf = buf.subarray(lineLength);
    }

    let columns = !options?.columns
      ? this.columns
      : Array.isArray(options.columns)
        ? this.normalizeColumns(lineLength, options.columns, shift)
        : options.columns;
    if (!Array.isArray(columns)) {
      columns = this.normalizeColumns(
        lineLength,
        columns({
          decode: (column: FixlenReaderColumn) => {
            const col: FixlenReaderColumn & { end: number } = {
              ...column,
              end:
                column.length != null
                  ? column.start + column.length
                  : lineLength,
            };
            return this.decode(col, line);
          },
        }),
        shift,
      );
    }

    for (let i = 0; i < columns.length; i++) {
      items.push(this.decode(columns[i], line));
    }

    this.index++;
    return items;
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<(string | number)[]> {
    let record: (string | number)[] | undefined;
    while ((record = await this.read()) != null) {
      yield record;
    }
  }

  get count() {
    return this.index;
  }

  async close() {
    const reader = await this.reader;
    await reader.cancel();
  }

  private normalizeColumns(
    lineLength: number,
    columns: FixlenReaderColumn[],
    shift: boolean,
  ): (FixlenReaderColumn & { end: number })[] {
    return columns.map((col, index, array) => {
      if (col.start < 0) {
        throw new RangeError(`columns[${index}].start must be positive.`);
      }
      if (col.start >= lineLength) {
        throw new RangeError(`columns[${index}].start is too large.`);
      }
      if (col.length != null && col.length <= 0) {
        throw new RangeError(`columns[${index}].length must be positive.`);
      }
      let end: number;
      if (col.length != null) {
        end = col.start + col.length;
        if (end > lineLength) {
          throw new RangeError(`columns[${index}].length is too large.`);
        }
      } else if (index + 1 === array.length) {
        end = lineLength;
      } else if (col.start < array[index + 1].start) {
        end = array[index + 1].start;
      } else {
        throw new RangeError(`columns[${index}].length is required.`);
      }
      return {
        start: col.start,
        end,
        length: col.length,
        shift: col.shift ?? shift,
        trim: col.trim,
        type: col.type,
      };
    });
  }

  private decode(col: FixlenReaderColumn & { end: number }, line: Uint8Array) {
    if (!col.type || col.type === "decimal") {
      let text = "";
      const minEnd = Math.min(col.end, line.length);
      if (col.start < minEnd) {
        text = this.decoder.decode(line.subarray(col.start, minEnd), {
          shift: col.shift,
        });
        switch (col.trim) {
          case "left":
            text = text.trimStart();
            break;
          case "right":
            text = text.trimEnd();
            break;
          case "both":
            text = text.trim();
            break;
        }
      }
      if (col.type === "decimal") {
        const num = Number.parseFloat(text);
        if (this.fatal && Number.isNaN(num)) {
          throw new RangeError(`Invalid number: ${text}`);
        }
        return num;
      }
      return text;
    } else if (col.type.startsWith("int-")) {
      const view = new DataView(line.buffer, line.byteOffset, line.byteLength);
      const littleEndien = col.type === "int-le";
      const len = col.end - col.start;
      if (len === 4) {
        return view.getInt32(col.start, littleEndien);
      } else if (len === 2) {
        return view.getInt16(col.start, littleEndien);
      } else if (len === 1) {
        return view.getInt8(col.start);
      } else {
        if (this.fatal) {
          throw new RangeError(
            `byte length of ${col.type} type must be 1, 2 or 4.`,
          );
        }
        return Number.NaN;
      }
    } else if (col.type.startsWith("uint-")) {
      const view = new DataView(line.buffer, line.byteOffset, line.byteLength);
      const littleEndien = col.type === "uint-le";
      const len = col.end - col.start;
      if (len === 4) {
        return view.getUint32(col.start, littleEndien);
      } else if (len === 2) {
        return view.getUint16(col.start, littleEndien);
      } else if (len === 1) {
        return view.getUint8(col.start);
      } else {
        if (this.fatal) {
          throw new RangeError(
            `byte length of ${col.type} type must be 1, 2 or 4.`,
          );
        }
        return Number.NaN;
      }
    } else if (col.type === "zoned" || col.type === "uzoned") {
      try {
        let num = 0;
        for (let i = col.start; i < col.end; i++) {
          const l4 = line[i] & 0xf;
          if (l4 > 0x9) {
            throw new RangeError(
              `low 4 bits of ${col.type} type must be 0-9: 0x${l4.toString(16).padStart(2, "0")}`,
            );
          }
          num = num * 10 + l4;

          const h4 = (line[i] >>> 4) & 0xf;
          if (col.type === "zoned" && i + 1 === col.end) {
            if (h4 <= 0x9) {
              throw new RangeError(
                `last high 4 bits of ${col.type} type must be A-F: 0x${h4.toString(16).padStart(2, "0")}`,
              );
            }
            if (h4 === 0xb || h4 === 0xd) {
              num *= -1;
            }
          } else if (h4 !== 0x0f) {
            throw new RangeError(
              `high 4 bits of ${col.type} type must be F: 0x${h4.toString(16).padStart(2, "0")}`,
            );
          }
        }
        return num;
      } catch (err) {
        if (this.fatal) {
          throw err;
        }
        return Number.NaN;
      }
    } else if (col.type === "packed" || col.type === "upacked") {
      try {
        let num = 0;
        for (let i = col.start; i < col.end; i++) {
          const h4 = (line[i] >> 4) & 0xf;
          if (h4 > 0x9) {
            throw new RangeError(
              `high 4 bits of ${col.type} type must be 0-9: 0x${h4.toString(16).padStart(2, "0")}`,
            );
          }
          num = num * 10 + h4;

          const l4 = line[i] & 0xf;
          if (col.type === "packed" && i + 1 === col.end) {
            if (l4 <= 0x9) {
              throw new RangeError(
                `last low 4 bits of ${col.type} type must be A-F: 0x${l4.toString(16).padStart(2, "0")}`,
              );
            }
            if (l4 === 0xb || l4 === 0xd) {
              num *= -1;
            }
          } else {
            if (l4 > 0x9) {
              throw new RangeError(
                `low 4 bits of ${col.type} type must be 0-9: 0x${l4.toString(16).padStart(2, "0")}`,
              );
            }
            num = num * 10 + l4;
          }
        }
        return num;
      } catch (err) {
        if (this.fatal) {
          throw err;
        }
        return Number.NaN;
      }
    } else {
      throw new RangeError(`unknown column type: ${col.type}`);
    }
  }

  private concat(a1: Uint8Array, a2: Uint8Array) {
    const result = new Uint8Array(a1.length + a2.length);
    result.set(a1, 0);
    result.set(a2, a1.length);
    return result;
  }
}
