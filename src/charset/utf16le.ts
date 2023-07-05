import { Charset, CharsetDecoderOptions, CharsetEncoderOptions } from "./charset.js"
import { StandardDecoder } from "../decode/StandardDecoder.js"
import { Utf16leEncoder } from "../encode/Utf16leEncoder.js"

class Utf16leCharset implements Charset {
  createDecoder(options?: CharsetDecoderOptions) {
    return new StandardDecoder("utf-16le")
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new Utf16leEncoder()
  }
}

export default new Utf16leCharset()
