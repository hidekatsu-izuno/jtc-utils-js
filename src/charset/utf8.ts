import { Charset, CharsetDecoderOptions, CharsetEncoderOptions } from "./charset.js"
import { StandardEncoder } from "../encode/StandardEncoder.js"
import { StandardDecoder } from "../decode/StandardDecoder.js"

class Utf8Charset implements Charset {
  createDecoder(options?: CharsetDecoderOptions) {
    return new StandardDecoder("utf-8")
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new StandardEncoder("utf-8")
  }
}

export default new Utf8Charset()
