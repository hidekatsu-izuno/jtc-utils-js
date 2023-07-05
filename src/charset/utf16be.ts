import { Charset, CharsetDecoderOptions, CharsetEncodeOptions, CharsetEncoder, CharsetEncoderOptions, StandardDecoder } from "./charset.js"

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
  canEncode(str: string, options?: CharsetEncodeOptions) {
    return true
  }

  encode(str: string, options?: CharsetEncodeOptions): Uint8Array {
    const out = new Uint8Array(str.length * 2)
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      out[i * 2] = (cp >>> 8)  & 0xFF
      out[i * 2 + 1] = cp & 0xFF
    }
    return out
  }
}

export const utf16be = new Utf16beCharset()
