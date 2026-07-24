import { PackedMap } from "../util/PackedMap.ts";
import {
  type Charset,
  type CharsetDecodeOptions,
  type CharsetDecoder,
  type CharsetDecoderOptions,
  type CharsetEncodeOptions,
  type CharsetEncoder,
  type CharsetEncoderOptions,
  StandardDecoder,
} from "./charset.ts";
import { windows31j } from "./windows31j.ts";

class Cp943cCharset implements Charset {
  get name() {
    return "cp943c";
  }

  createDecoder(options?: CharsetDecoderOptions) {
    return new Cp943cDecoder(options);
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new Cp943cEncoder(options);
  }

  isUnicode() {
    return false;
  }

  isEbcdic() {
    return false;
  }
}

const Cp943cEncodeMap = new PackedMap((m) => {
  // CP943C mappings that differ from windows-31j.
  m.set(0xa6, 0xfa55);
  m.set(0x2116, 0xfa59);
  m.set(0x2121, 0xfa5a);
  m.set(0x2160, 0xfa4a);
  m.set(0x2161, 0xfa4b);
  m.set(0x2162, 0xfa4c);
  m.set(0x2163, 0xfa4d);
  m.set(0x2164, 0xfa4e);
  m.set(0x2165, 0xfa4f);
  m.set(0x2166, 0xfa50);
  m.set(0x2167, 0xfa51);
  m.set(0x2168, 0xfa52);
  m.set(0x2169, 0xfa53);
  m.set(0x301c, 0x8160);
  m.set(0x3231, 0xfa58);
  m.set(0x4fe0, 0x8ba0);
  m.set(0x525d, 0x948d);
  m.set(0x555e, 0x88a0);
  m.set(0x5699, 0x8a9a);
  m.set(0x56ca, 0x9458);
  m.set(0x5861, 0x9355);
  m.set(0x5c5b, 0x9ba0);
  m.set(0x5c62, 0x8ec6);
  m.set(0x6414, 0x917e);
  m.set(0x6451, 0x92cd);
  m.set(0x6522, 0x9db7);
  m.set(0x6805, 0x8df2);
  m.set(0x688e, 0x9e94);
  m.set(0x6f51, 0x94ac);
  m.set(0x7006, 0x93c0);
  m.set(0x7130, 0x898b);
  m.set(0x7626, 0x9189);
  m.set(0x79b1, 0x9398);
  m.set(0x7c1e, 0x925c);
  m.set(0x7e48, 0xe379);
  m.set(0x7e61, 0x8f4a);
  m.set(0x7e6b, 0x8c71);
  m.set(0x8141, 0xe445);
  m.set(0x8346, 0x8c74);
  m.set(0x840a, 0x9789);
  m.set(0x8523, 0x8fd3);
  m.set(0x87ec, 0x90e4);
  m.set(0x881f, 0x9858);
  m.set(0x8ec0, 0x8beb);
  m.set(0x91ac, 0x8fdd);
  m.set(0x91b1, 0x94ae);
  m.set(0x9830, 0x966a);
  m.set(0x9839, 0xe8f6);
  m.set(0x985a, 0x935e);
  m.set(0x9a52, 0x91cb);
  m.set(0x9dd7, 0x89a8);
  m.set(0x9e7c, 0x8cb2);
  m.set(0x9eb4, 0x8d8d);
  m.set(0x9eb5, 0x96cb);
  m.set(0xf86f, 0xfa59);
});

const Cp943cEncodeExclusions = new Set([
  0xa2, 0xa3, 0xab, 0xac, 0xaf, 0xb5, 0xb7, 0xb8, 0xbb, 0x3094,
]);

class Cp943cDecoder implements CharsetDecoder {
  private decoder: StandardDecoder;

  constructor(options?: CharsetDecoderOptions) {
    this.decoder = new StandardDecoder("windows-31j", options);
  }

  decode(input: Uint8Array, options?: CharsetDecodeOptions) {
    const decoded = this.decoder.decode(input, options);
    const output: number[] = [];
    for (let i = 0; i < decoded.length; i++) {
      const cp = decoded.charCodeAt(i);
      switch (cp) {
        // CP943C mappings that differ from windows-31j.
        case 0x1a:
          output.push(0x7f);
          break;
        case 0x1c:
          output.push(0x1a);
          break;
        case 0x7f:
          output.push(0x1c);
          break;
        case 0x2015:
          output.push(0x2014);
          break;
        case 0x2225:
          output.push(0x2016);
          break;
        case 0xff0d:
          output.push(0x2212);
          break;
        case 0xff5e:
          output.push(0x301c);
          break;
        case 0xffe4:
          output.push(0xa6);
          break;
        default:
          output.push(cp);
          break;
      }
    }
    return String.fromCharCode(...output);
  }
}

class Cp943cEncoder implements CharsetEncoder {
  private fatal: boolean;
  private encoder: CharsetEncoder;

  constructor(options?: CharsetEncoderOptions) {
    this.fatal = options?.fatal ?? true;
    this.encoder = windows31j.createEncoder(options);

    Cp943cEncodeMap.initialize();
  }

  canEncode(str: string) {
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i);
      if (Cp943cEncodeExclusions.has(cp)) {
        return false;
      }
      if (Cp943cEncodeMap.get(cp) == null && !this.encoder.canEncode(str[i])) {
        return false;
      }
    }
    return true;
  }

  encode(str: string, options?: CharsetEncodeOptions) {
    const out: number[] = [];
    const limit = options?.limit ?? Number.POSITIVE_INFINITY;

    for (let i = 0; i < str.length; i++) {
      const prev = out.length;
      const cp = str.charCodeAt(i);
      const enc = Cp943cEncodeMap.get(cp);

      if (enc != null) {
        if (enc > 0xff) {
          out.push((enc >>> 8) & 0xff);
          out.push(enc & 0xff);
        } else {
          out.push(enc);
        }
      } else if (Cp943cEncodeExclusions.has(cp)) {
        if (this.fatal) {
          throw TypeError(
            `The code point ${cp.toString(16)} could not be encoded`,
          );
        }
        out.push(0x5f); // ?
      } else {
        const encoded = this.encoder.encode(str[i], {
          limit: limit - out.length,
        });
        out.push(...encoded);
      }

      if (out.length > limit) {
        out.length = prev;
        break;
      }
    }

    return Uint8Array.from(out);
  }
}

export const cp943c = new Cp943cCharset();
