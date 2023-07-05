import { Encoder, EncoderEncodeOptions } from "./encoder.js"

export class Utf8Encoder implements Encoder {
  private encoder = new TextEncoder()

  canEncode(str: string, options?: EncoderEncodeOptions) {
    return true
  }

  encode(str: string, options?: EncoderEncodeOptions): Uint8Array {
    return this.encoder.encode(str)
  }
}
