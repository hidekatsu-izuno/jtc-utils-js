import { Encoder, EncoderEncodeOptions } from "./encoder.js"

export class Utf16beEncoder implements Encoder {
  canEncode(str: string, options?: EncoderEncodeOptions) {
    return true
  }

  encode(str: string, options?: EncoderEncodeOptions): Uint8Array {
    const out = new Uint8Array(str.length * 2)
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      out[i * 2] = (cp >>> 8)  & 0xFF
      out[i * 2 + 1] = cp & 0xFF
    }
    return out
  }
}
