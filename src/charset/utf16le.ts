import { Charset, CharsetDecoderOptions, CharsetEncodeOptions, CharsetEncoder, CharsetEncoderOptions, StandardDecoder } from "./charset.js"

class Utf16leCharset implements Charset {
  get name() {
    return "utf-16le"
  }

  createDecoder(options?: CharsetDecoderOptions) {
    return new StandardDecoder("utf-16le", options)
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new Utf16leEncoder()
  }

  isUnicode() {
    return true
  }

  isEbcdic() {
    return false
  }
}

class Utf16leEncoder implements CharsetEncoder {
  canEncode(str: string) {
    return true
  }

  encode(str: string, options?: CharsetEncodeOptions): Uint8Array {
    const out = new Uint8Array(str.length * 2)
    const limit = options?.limit ?? Number.POSITIVE_INFINITY
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      out[i * 2] = cp & 0xFF
      out[i * 2 + 1] = (cp >>> 8) & 0xFF
    }
    if (out.length > limit) {
      return out.subarray(0, Math.floor(limit / 2) * 2)
    }
    return out
  }
}

export const utf16le = new Utf16leCharset()
