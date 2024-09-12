import { PackedMap } from "../util/PackedMap.ts";
import { JISEncodeMap } from "./JISEncodeMap.ts";
import {
  type Charset,
  type CharsetDecoderOptions,
  type CharsetEncodeOptions,
  type CharsetEncoder,
  type CharsetEncoderOptions,
  StandardDecoder,
} from "./charset.ts";

class EucjpCharset implements Charset {
  get name() {
    return "euc-jp";
  }

  createDecoder(options?: CharsetDecoderOptions) {
    return new StandardDecoder("euc-jp");
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new EucjpEncoder(options);
  }

  isUnicode() {
    return false;
  }

  isEbcdic() {
    return false;
  }
}

const EucjpEncodeMap = new PackedMap((m) => {
  const decoder = new TextDecoder("euc-jp");
  // EUC-JP additional mapping
  m.set(0xa5, 0x5c);
  m.set(0x203e, 0x7e);
  m.set(0x2170, 0x8ff3f3);
  m.set(0x2171, 0x8ff3f4);
  m.set(0x2172, 0x8ff3f5);
  m.set(0x2173, 0x8ff3f6);
  m.set(0x2174, 0x8ff3f7);
  m.set(0x2175, 0x8ff3f8);
  m.set(0x2176, 0x8ff3f9);
  m.set(0x2177, 0x8ff3fa);
  m.set(0x2178, 0x8ff3fb);
  m.set(0x2179, 0x8ff3fc);
  m.set(0x2212, 0xa1dd);
  m.set(0x2225, 0xa1c2);
  m.set(0x301c, 0xa1c1);
  const buf = new Uint8Array(3);
  buf[0] = 0x8f;
  for (const hba of [
    [0xa1, 0xab],
    [0xb0, 0xed],
    [0xf3, 0xf4],
  ]) {
    for (let hb = hba[0]; hb <= hba[1]; hb++) {
      buf[1] = hb;
      for (let lb = 0xa1; lb <= 0xfe; lb++) {
        buf[2] = lb;

        const decoded = decoder.decode(buf);
        if (decoded !== "\uFFFD") {
          m.set(decoded.charCodeAt(0), (0x8f << 16) | (hb << 8) | lb);
        }
      }
    }
  }
});

class EucjpEncoder implements CharsetEncoder {
  private fatal;

  constructor(options?: CharsetEncoderOptions) {
    this.fatal = options?.fatal ?? true;

    JISEncodeMap.initialize();
    EucjpEncodeMap.initialize();
  }

  canEncode(str: string, options?: CharsetEncodeOptions) {
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i);
      if (cp <= 0x7f) {
        // ASCII
        // no handle
      } else if (cp >= 0xff61 && cp <= 0xff9f) {
        // 半角カナ
        // no handle
      } else {
        let jis = JISEncodeMap.get(cp);
        if (jis != null) {
          // no handle
        } else if ((jis = EucjpEncodeMap.get(cp)) != null) {
          // no handle
        } else {
          return false;
        }
      }
    }
    return true;
  }

  encode(str: string, options?: CharsetEncodeOptions): Uint8Array {
    const out = new Array<number>();
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i);
      if (cp <= 0x7f) {
        // ASCII
        out.push(cp);
      } else if (cp >= 0xff61 && cp <= 0xff9f) {
        // 半角カナ
        out.push(0x8e);
        out.push(cp - 0xff61 + 0xa1);
      } else {
        let jis = JISEncodeMap.get(cp);
        if (jis != null) {
          out.push(((jis >>> 8) + 0x80) & 0xff);
          out.push((jis + 0x80) & 0xff);
        } else if ((jis = EucjpEncodeMap.get(cp)) != null) {
          if (jis > 0xffff) {
            out.push((jis >>> 16) & 0xff);
            out.push((jis >>> 8) & 0xff);
            out.push(jis & 0xff);
          } else if (jis > 0xff) {
            out.push((jis >>> 8) & 0xff);
            out.push(jis & 0xff);
          } else {
            out.push(jis & 0xff);
          }
        } else if (this.fatal) {
          throw TypeError(
            `The code point ${cp.toString(16)} could not be encoded`,
          );
        } else {
          out.push(0x5f); // ?
        }
      }
    }
    return Uint8Array.from(out);
  }
}

export const eucjp = new EucjpCharset();
