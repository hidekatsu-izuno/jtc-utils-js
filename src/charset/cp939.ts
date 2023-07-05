import { Charset, CharsetDecoderOptions, CharsetEncoderOptions } from "./charset.js"
import { Cp939Decoder } from "../decode/Cp939Decoder.js"
import { Cp939Encoder } from "../encode/Cp939Encoder.js"

class Cp939Charset implements Charset {
  createDecoder(options?: CharsetDecoderOptions) {
    return new Cp939Decoder(options)
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new Cp939Encoder(options)
  }
}

export default new Cp939Charset()
