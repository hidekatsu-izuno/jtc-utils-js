import type {
  Charset,
  CharsetDecodeOptions,
  CharsetDecoder,
  CharsetDecoderOptions,
  CharsetEncodeOptions,
  CharsetEncoder,
  CharsetEncoderOptions,
} from "./charset.ts";
import { cp943c } from "./cp943c.ts";

class Cp942Charset implements Charset {
  get name() {
    return "cp942";
  }

  createDecoder(options?: CharsetDecoderOptions) {
    return new Cp942Decoder(options);
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new Cp942Encoder(options);
  }

  isUnicode() {
    return false;
  }

  isEbcdic() {
    return false;
  }
}

// Differences from CP943C, verified against data/{encode,decode}.cp942.csv.
// Encoding and decoding are separate because some mappings are not reversible.
const Cp942EncodeMap = new Map<number, number>([
  [0x001a, 0x007f],
  [0x001c, 0x001a],
  [0x005c, 0x00fe],
  [0x007e, 0x00ff],
  [0x007f, 0x001c],
  [0x00a2, 0x0080],
  [0x00a3, 0x00a0],
  [0x00ac, 0x00fd],
  [0x2235, 0xfa5b],
  [0x4fad, 0x98d4],
  [0x5118, 0x9699],
  [0x551e, 0x90e4],
  [0x582f, 0x8bc4],
  [0x58f7, 0x9ae2],
  [0x58fa, 0x92d9],
  [0x5c2d, 0xea9f],
  [0x64b9, 0x9d98],
  [0x652a, 0x8a68],
  [0x6602, 0xfad0],
  [0x663b, 0x8d56],
  [0x6867, 0x9e77],
  [0x68bc, 0x9e8d],
  [0x69c7, 0x968a],
  [0x69d9, 0xeaa0],
  [0x6a9c, 0x954f],
  [0x6aae, 0x938e],
  [0x6d00, 0x93c0],
  [0x6d9b, 0x9fb7],
  [0x6f1e, 0x91cb],
  [0x6f45, 0x9ff3],
  [0x6fe4, 0x9393],
  [0x704c, 0x8ac1],
  [0x70ff, 0x8ba0],
  [0x7155, 0xeaa4],
  [0x7199, 0xe086],
  [0x7464, 0xe0f4],
  [0x7476, 0xeaa2],
  [0x783a, 0xe1e8],
  [0x783f, 0xe1e6],
  [0x7926, 0x8d7b],
  [0x792a, 0x9376],
  [0x7ac3, 0xe27d],
  [0x7ac8, 0x8a96],
  [0x7bed, 0xe2c4],
  [0x7c60, 0x9855],
  [0x854a, 0xe541],
  [0x85ae, 0xe54d],
  [0x85ea, 0x96f7],
  [0x8602, 0x8ec7],
  [0x86ce, 0xe579],
  [0x8741, 0x88a0],
  [0x877f, 0xe5a2],
  [0x8805, 0x9488],
  [0x8823, 0x8a61],
  [0x8acc, 0xe67c],
  [0x8aeb, 0x8ad0],
  [0x8cce, 0xe6cb],
  [0x8ce4, 0x9147],
  [0x8f91, 0xfa59],
  [0x8fe9, 0xe78e],
  [0x9059, 0x9779],
  [0x9065, 0xeaa1],
  [0x9087, 0x93f4],
  [0x92ca, 0x8a9a],
  [0x976d, 0xe8d5],
  [0x9771, 0x9078],
  [0x981a, 0xe8f2],
  [0x9838, 0x8c7a],
  [0x9bf5, 0xe9cb],
  [0x9c3a, 0x88b1],
  [0x9d2c, 0xe9f2],
  [0x9daf, 0x89a7],
  [0xffe2, 0xfa54],
]);

const Cp942EncodeExclusions = new Set([
  0x2211, 0x221f, 0x222e, 0x22bf, 0x2460, 0x2461, 0x2462, 0x2463, 0x2464,
  0x2465, 0x2466, 0x2467, 0x2468, 0x2469, 0x246a, 0x246b, 0x246c, 0x246d,
  0x246e, 0x246f, 0x2470, 0x2471, 0x2472, 0x2473, 0x301d, 0x301f, 0x3232,
  0x3239, 0x32a4, 0x32a5, 0x32a6, 0x32a7, 0x32a8, 0x3303, 0x330d, 0x3314,
  0x3318, 0x3322, 0x3323, 0x3326, 0x3327, 0x332b, 0x3336, 0x333b, 0x3349,
  0x334a, 0x334d, 0x3351, 0x3357, 0x337b, 0x337c, 0x337d, 0x337e, 0x338e,
  0x338f, 0x339c, 0x339d, 0x339e, 0x33a1, 0x33c4, 0x33cd,
]);

const Cp942DecodeMap = new Map<number, number>([
  [0x001a, 0x001c],
  [0x001c, 0x007f],
  [0x005c, 0x00a5],
  [0x007e, 0x203e],
  [0x007f, 0x001a],
  [0x0080, 0x00a2],
  [0x00a0, 0x00a3],
  [0x00fd, 0x00ac],
  [0x00fe, 0x005c],
  [0x00ff, 0x007e],
  [0x88b1, 0x9c3a],
  [0x89a7, 0x9daf],
  [0x8a61, 0x8823],
  [0x8a68, 0x652a],
  [0x8a96, 0x7ac8],
  [0x8ac1, 0x704c],
  [0x8ad0, 0x8aeb],
  [0x8bc4, 0x582f],
  [0x8c7a, 0x9838],
  [0x8d56, 0x663b],
  [0x8d7b, 0x7926],
  [0x8ec7, 0x8602],
  [0x9078, 0x9771],
  [0x9147, 0x8ce4],
  [0x92d9, 0x58fa],
  [0x9376, 0x792a],
  [0x938e, 0x6aae],
  [0x9393, 0x6fe4],
  [0x93f4, 0x9087],
  [0x9488, 0x8805],
  [0x954f, 0x6a9c],
  [0x968a, 0x69c7],
  [0x9699, 0x5118],
  [0x96f7, 0x85ea],
  [0x9779, 0x9059],
  [0x9855, 0x7c60],
  [0x98d4, 0x4fad],
  [0x9ae2, 0x58f7],
  [0x9d98, 0x64b9],
  [0x9e77, 0x6867],
  [0x9e8d, 0x68bc],
  [0x9fb7, 0x6d9b],
  [0x9ff3, 0x6f45],
  [0xe086, 0x7199],
  [0xe0f4, 0x7464],
  [0xe1e6, 0x783f],
  [0xe1e8, 0x783a],
  [0xe27d, 0x7ac3],
  [0xe2c4, 0x7bed],
  [0xe541, 0x854a],
  [0xe54d, 0x85ae],
  [0xe579, 0x86ce],
  [0xe5a2, 0x877f],
  [0xe67c, 0x8acc],
  [0xe6cb, 0x8cce],
  [0xe78e, 0x8fe9],
  [0xe8d5, 0x976d],
  [0xe8f2, 0x981a],
  [0xe9cb, 0x9bf5],
  [0xe9f2, 0x9d2c],
  [0xea9f, 0x5c2d],
  [0xeaa0, 0x69d9],
  [0xeaa1, 0x9065],
  [0xeaa2, 0x7476],
  [0xeaa4, 0x7155],
  [0xfad0, 0x6602],
]);

class Cp942Decoder implements CharsetDecoder {
  private fatal: boolean;
  private decoder: CharsetDecoder;
  private pending: number | undefined;

  constructor(options?: CharsetDecoderOptions) {
    this.fatal = options?.fatal ?? true;
    this.decoder = cp943c.createDecoder(options);
  }

  decode(input: Uint8Array, options?: CharsetDecodeOptions) {
    const output: string[] = [];
    let lead = this.pending;
    this.pending = undefined;
    const invalid = () => {
      if (this.fatal) {
        throw new TypeError(
          "The encoded data was not valid for encoding cp942",
        );
      }
      output.push("\ufffd");
    };
    for (let i = 0; i < input.length; i++) {
      const byte = input[i];
      if (lead == null) {
        if ((byte >= 0x81 && byte <= 0x9f) || (byte >= 0xe0 && byte <= 0xfc)) {
          lead = byte;
          continue;
        }
        const cp = Cp942DecodeMap.get(byte);
        output.push(
          cp != null
            ? String.fromCharCode(cp)
            : this.decoder.decode(Uint8Array.of(byte)),
        );
      } else {
        const code = (lead << 8) | byte;
        const bytes = Uint8Array.of(lead, byte);
        lead = undefined;
        if (byte < 0x40 || byte === 0x7f || byte > 0xfc) {
          invalid();
          // Process the invalid trail again as the start of the next character.
          i--;
        } else if (
          code === 0x81ca ||
          code === 0x81e6 ||
          bytes[0] === 0x87 ||
          bytes[0] === 0xed ||
          bytes[0] === 0xee
        ) {
          // CP943C extension and duplicate mappings absent from CP942.
          invalid();
        } else {
          const cp = Cp942DecodeMap.get(code);
          output.push(
            cp != null ? String.fromCharCode(cp) : this.decoder.decode(bytes),
          );
        }
      }
    }
    if (lead != null) {
      if (options?.stream) {
        this.pending = lead;
      } else {
        invalid();
      }
    }
    return output.join("");
  }
}

class Cp942Encoder implements CharsetEncoder {
  private fatal: boolean;
  private encoder: CharsetEncoder;

  constructor(options?: CharsetEncoderOptions) {
    this.fatal = options?.fatal ?? true;
    this.encoder = cp943c.createEncoder(options);
  }

  canEncode(str: string) {
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i);
      if (
        Cp942EncodeExclusions.has(cp) ||
        (!Cp942EncodeMap.has(cp) && !this.encoder.canEncode(str[i]))
      ) {
        return false;
      }
    }
    return true;
  }

  encode(str: string, options?: CharsetEncodeOptions) {
    const output: number[] = [];
    const limit = options?.limit ?? Number.POSITIVE_INFINITY;
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i);
      const code = Cp942EncodeMap.get(cp);
      let bytes: Uint8Array;
      if (code != null) {
        bytes =
          code <= 0xff
            ? Uint8Array.of(code)
            : Uint8Array.of(code >>> 8, code & 0xff);
      } else if (Cp942EncodeExclusions.has(cp)) {
        if (this.fatal) {
          throw new TypeError(
            `The code point ${cp.toString(16)} could not be encoded`,
          );
        }
        bytes = Uint8Array.of(0x5f);
      } else {
        bytes = this.encoder.encode(str[i]);
      }
      if (output.length + bytes.length > limit) {
        break;
      }
      output.push(...bytes);
    }
    return Uint8Array.from(output);
  }
}

export const cp942 = new Cp942Charset();
