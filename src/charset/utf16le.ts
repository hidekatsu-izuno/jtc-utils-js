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
  canEncode(str: string, options?: CharsetEncodeOptions) {
    return true
  }

  encode(str: string, options?: CharsetEncodeOptions): Uint8Array {
    const out = new Uint8Array(str.length * 2)
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      out[i * 2] = cp & 0xFF
      out[i * 2 + 1] = (cp >>> 8) & 0xFF
    }
    return out
  }
}

export const utf16le = new Utf16leCharset()
