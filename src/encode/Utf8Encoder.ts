import { Encoder, EncoderOptions } from "./encoder.js"

export class Utf8Encoder implements Encoder {
  private encoder = new TextEncoder()

  canEncode(str: string) {
    return true
  }

  encode(str: string): Uint8Array {
    return this.encoder.encode(str)
  }
}
