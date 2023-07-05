import { Charset, CharsetDecoderOptions, CharsetEncoderOptions } from "./charset.js"
import { StandardDecoder } from "../decode/StandardDecoder.js"
import { Windows31jEncoder } from "../encode/Windows31jEncoder.js"

class Windows31jCharset implements Charset {
  createDecoder(options?: CharsetDecoderOptions) {
    return new StandardDecoder("windows-31j")
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new Windows31jEncoder(options)
  }
}

export default new Windows31jCharset()
