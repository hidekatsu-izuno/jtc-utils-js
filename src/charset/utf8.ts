import { Charset, CharsetDecoderOptions, CharsetEncoderOptions, StandardDecoder, StandardEncoder } from "./charset.js"

class Utf8Charset implements Charset {
  get name() {
    return "utf-8"
  }

  createDecoder(options?: CharsetDecoderOptions) {
    return new StandardDecoder("utf-8", options)
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new StandardEncoder("utf-8", options)
  }

  isUnicode() {
    return true
  }

  isEbcdic() {
    return false
  }
}

export default new Utf8Charset()
