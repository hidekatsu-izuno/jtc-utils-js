import { Charset, CharsetDecoderOptions, CharsetEncoderOptions } from "./charset.js"
import { Cp930Decoder } from "../decode/Cp930Decoder.js"
import { Cp930Encoder } from "../encode/Cp930Encoder.js"

class Cp930Charset implements Charset {
  createDecoder(options?: CharsetDecoderOptions) {
    return new Cp930Decoder(options)
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new Cp930Encoder(options)
  }
}

export default new Cp930Charset()
