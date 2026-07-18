import type {
  Charset,
  CharsetDecodeOptions,
  CharsetDecoder,
  CharsetDecoderOptions,
  CharsetEncodeOptions,
  CharsetEncoder,
  CharsetEncoderOptions,
} from "./charset.ts";
import { JEFKanjiDecodeMap, JEFKanjiDecodeSpMap } from "./JEFKanjiDecodeMap.ts";
import { JEFKanjiEncodeMap, JEFKanjiEncodeSpMap } from "./JEFKanjiEncodeMap.ts";

class XFujitsuJefCharset implements Charset {
  get name() {
    return "x-fujitsu-jef";
  }

  createDecoder(options?: CharsetDecoderOptions) {
    return new XFujitsuJefDecoder(options);
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new XFujitsuJefEncoder(options);
  }

  isUnicode() {
    return false;
  }

  isEbcdic() {
    return true;
  }
}

class XFujitsuJefDecoder implements CharsetDecoder {
  private readonly fatal: boolean;
  private pending?: number;

  constructor(options?: CharsetDecoderOptions) {
    this.fatal = options?.fatal ?? true;
    JEFKanjiDecodeMap.initialize();
    JEFKanjiDecodeSpMap.initialize();
  }

  decode(input: Uint8Array, options?: CharsetDecodeOptions): string {
    const output: number[] = [];
    let index = 0;

    if (this.pending != null) {
      const pending = this.pending;
      this.pending = undefined;
      if (input.length > 0) {
        this.decodePair(pending, input[index++], output);
      } else if (!options?.stream) {
        this.fail(pending, output);
      } else {
        this.pending = pending;
      }
    }

    while (index + 1 < input.length) {
      this.decodePair(input[index], input[index + 1], output);
      index += 2;
    }

    if (index < input.length) {
      if (options?.stream) {
        this.pending = input[index];
      } else {
        this.fail(input[index], output);
      }
    }

    return fromCodePoints(output);
  }

  private decodePair(high: number, low: number, output: number[]) {
    if (high >= 0x80 && high <= 0xa0 && low >= 0xa1 && low <= 0xfe) {
      output.push(0xe000 + (high - 0x80) * 94 + (low - 0xa1));
      return;
    }

    const code = (high << 8) | low;
    const unicode = JEFKanjiDecodeMap.get(code);
    if (unicode != null) {
      output.push(unicode);
      const sp = JEFKanjiDecodeSpMap.get(code);
      if (sp != null) {
        output.push(sp);
      }
    } else {
      this.fail(code, output);
    }
  }

  private fail(code: number, output: number[]) {
    if (this.fatal) {
      throw TypeError(`The input ${code.toString(16)} could not be decoded.`);
    }
    output.push(0xfffd);
  }
}

class XFujitsuJefEncoder implements CharsetEncoder {
  private readonly fatal: boolean;

  constructor(options?: CharsetEncoderOptions) {
    this.fatal = options?.fatal ?? true;
    JEFKanjiEncodeMap.initialize();
    JEFKanjiEncodeSpMap.initialize();
  }

  canEncode(str: string) {
    for (let i = 0; i < str.length; ) {
      const unicode = str.codePointAt(i) as number;
      const length = unicode > 0xffff ? 2 : 1;
      const spCode = JEFKanjiEncodeSpMap.get(unicode);
      if (spCode != null && str.codePointAt(i + length) === 0x3099) {
        i += length + 1;
      } else if (this.getCode(unicode) != null) {
        i += length;
      } else {
        return false;
      }
    }
    return true;
  }

  encode(str: string, options?: CharsetEncodeOptions): Uint8Array {
    const limit = options?.limit ?? Number.POSITIVE_INFINITY;
    const output: number[] = [];

    for (let i = 0; i < str.length; ) {
      if (output.length + 2 > limit) {
        break;
      }

      const unicode = str.codePointAt(i) as number;
      const length = unicode > 0xffff ? 2 : 1;
      let consumed = length;
      let code = JEFKanjiEncodeSpMap.get(unicode);
      if (code != null && str.codePointAt(i + length) === 0x3099) {
        consumed++;
      } else {
        code = this.getCode(unicode);
      }

      if (code == null) {
        if (this.fatal) {
          throw TypeError(
            `The code point ${unicode.toString(16)} could not be encoded.`,
          );
        }
        code = 0x4040;
      }

      output.push((code >>> 8) & 0xff, code & 0xff);
      i += consumed;
    }

    return Uint8Array.from(output);
  }

  private getCode(unicode: number) {
    if (unicode >= 0xe000 && unicode <= 0xec1d) {
      const offset = unicode - 0xe000;
      return ((0x80 + Math.floor(offset / 94)) << 8) | (0xa1 + (offset % 94));
    }
    return JEFKanjiEncodeMap.get(unicode);
  }
}

function fromCodePoints(codePoints: number[]) {
  const chunks: string[] = [];
  for (let i = 0; i < codePoints.length; i += 0x1000) {
    chunks.push(String.fromCodePoint(...codePoints.slice(i, i + 0x1000)));
  }
  return chunks.join("");
}

export const xFujitsuJef = new XFujitsuJefCharset();
