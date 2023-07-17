import { Charset, CharsetDecoderOptions, CharsetEncodeOptions, CharsetEncoder, CharsetEncoderOptions, StandardDecoder } from "./charset.ts"

class Utf16beCharset implements Charset {
  get name() {
    return "utf-16be"
  }

  createDecoder(options?: CharsetDecoderOptions) {
    return new StandardDecoder("utf-16be", options)
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new Utf16beEncoder()
  }

  isUnicode() {
    return true
  }

  isEbcdic() {
    return false
  }
}

class Utf16beEncoder implements CharsetEncoder {
  canEncode(str: string) {
    return true
  }

  encode(str: string, options?: CharsetEncodeOptions): Uint8Array {
    const out = new Uint8Array(str.length * 2)
    const limit = options?.limit ?? Number.POSITIVE_INFINITY
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      out[i * 2] = (cp >>> 8)  & 0xFF
      out[i * 2 + 1] = cp & 0xFF
    }
    if (out.length > limit) {
      return out.subarray(0, Math.floor(limit / 2) * 2)
    }
    return out
  }
}

export const utf16be = new Utf16beCharset()
