import { Encoder } from "./encoder.js"

export class Utf16LeEncoder implements Encoder {
  canEncode(str: string) {
    return true
  }

  encode(str: string): Uint8Array {
    const out = new Uint8Array(str.length * 2)
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      out[i * 2] =cp & 0xFF
      out[i * 2 + 1] = (cp >>> 8) & 0xFF
    }
    return new Uint8Array(out)
  }
}
