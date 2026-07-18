import { PackedMap } from "../util/PackedMap.ts";
import type {
  Charset,
  CharsetDecoder,
  CharsetDecoderOptions,
  CharsetEncodeOptions,
  CharsetEncoder,
  CharsetEncoderOptions,
} from "./charset.ts";

export function createFujitsuEbcdicCharset(
  name: string,
  decodeMap: Uint16Array,
  encodeDifferences: ReadonlyArray<readonly [number, number]>,
): Charset {
  const encodeMap = new PackedMap((m) => {
    for (const [unicode, code] of encodeDifferences) {
      m.set(unicode, code);
    }
    for (let code = 0; code <= 0xff; code++) {
      const unicode = decodeMap[code];
      if (unicode !== 0xfffd) {
        m.set(unicode, code);
      }
    }
  });

  return new FujitsuEbcdicCharset(name, decodeMap, encodeMap);
}

class FujitsuEbcdicCharset implements Charset {
  private readonly charsetName: string;
  private readonly decodeMap: Uint16Array;
  private readonly encodeMap: PackedMap;

  constructor(
    charsetName: string,
    decodeMap: Uint16Array,
    encodeMap: PackedMap,
  ) {
    this.charsetName = charsetName;
    this.decodeMap = decodeMap;
    this.encodeMap = encodeMap;
  }

  get name() {
    return this.charsetName;
  }

  createDecoder(options?: CharsetDecoderOptions) {
    return new FujitsuEbcdicDecoder(this.decodeMap, options);
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new FujitsuEbcdicEncoder(this.encodeMap, options);
  }

  isUnicode() {
    return false;
  }

  isEbcdic() {
    return true;
  }
}

class FujitsuEbcdicDecoder implements CharsetDecoder {
  private readonly fatal: boolean;
  private readonly decodeMap: Uint16Array;

  constructor(decodeMap: Uint16Array, options?: CharsetDecoderOptions) {
    this.decodeMap = decodeMap;
    this.fatal = options?.fatal ?? true;
  }

  decode(input: Uint8Array) {
    const output: number[] = [];
    for (const code of input) {
      const unicode = this.decodeMap[code];
      if (unicode !== 0xfffd) {
        output.push(unicode);
      } else if (this.fatal) {
        throw TypeError(`The input ${code.toString(16)} could not be decoded.`);
      } else {
        output.push(0xfffd);
      }
    }
    return String.fromCharCode(...output);
  }
}

class FujitsuEbcdicEncoder implements CharsetEncoder {
  private readonly fatal: boolean;
  private readonly encodeMap: PackedMap;

  constructor(encodeMap: PackedMap, options?: CharsetEncoderOptions) {
    this.encodeMap = encodeMap;
    this.fatal = options?.fatal ?? true;
    this.encodeMap.initialize();
  }

  canEncode(str: string) {
    for (let i = 0; i < str.length; i++) {
      if (this.encodeMap.get(str.charCodeAt(i)) == null) {
        return false;
      }
    }
    return true;
  }

  encode(str: string, options?: CharsetEncodeOptions): Uint8Array {
    const limit = options?.limit ?? Number.POSITIVE_INFINITY;
    const output: number[] = [];
    for (let i = 0; i < str.length && output.length < limit; i++) {
      const unicode = str.charCodeAt(i);
      const code = this.encodeMap.get(unicode);
      if (code != null) {
        output.push(code);
      } else if (this.fatal) {
        throw TypeError(
          `The code point ${unicode.toString(16)} could not be encoded.`,
        );
      } else {
        output.push(this.encodeMap.get(0x3f) ?? 0x6f);
      }
    }
    return Uint8Array.from(output);
  }
}
