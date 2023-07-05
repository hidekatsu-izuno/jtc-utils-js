import { Charset, CharsetDecoderOptions, CharsetEncoderOptions } from "./charset.js"
import { StandardDecoder } from "../decode/StandardDecoder.js"
import { Utf16beEncoder } from "../encode/Utf16beEncoder.js"

class Utf16beCharset implements Charset {
  createDecoder(options?: CharsetDecoderOptions) {
    return new StandardDecoder("utf-16be")
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new Utf16beEncoder()
  }
}

export default new Utf16beCharset()
