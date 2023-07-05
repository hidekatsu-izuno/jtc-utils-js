import { Charset, CharsetDecoderOptions, CharsetEncoderOptions } from "./charset.js"
import { StandardDecoder } from "../decode/StandardDecoder.js"
import { EucjpEncoder } from "../encode/EucjpEncoder.js"

class EucjpCharset implements Charset {
  createDecoder(options?: CharsetDecoderOptions) {
    return new StandardDecoder("euc-jp")
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new EucjpEncoder(options)
  }
}

export default new EucjpCharset()
