import { Encoder, EncoderEncodeOptions } from "./encoder.js"

export class StandardEncoder implements Encoder {
  private encoder = new TextEncoder()

  constructor(encoding: string) {
    switch (encoding) {
      case "utf-8":
      case "utf8":
      case "unicode-1-1-utf-8":
        break
      default:
        throw new RangeError(`The encoding is invalid: ${encoding}`)
    }
  }

  canEncode(str: string, options?: EncoderEncodeOptions) {
    return true
  }

  encode(str: string, options?: EncoderEncodeOptions): Uint8Array {
    return this.encoder.encode(str)
  }
}
