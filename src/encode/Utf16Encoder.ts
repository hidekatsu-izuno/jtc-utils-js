import { Encoder } from "./encoder.js"

export class Utf16Encoder implements Encoder {
  constructor(
    public bigEndien: boolean
  ) {
  }

  canEncode(str: string) {
    return true
  }

  encode(str: string): Uint8Array {
    const out = new Array<number>()
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      if (this.bigEndien) {
        out.push((cp >>> 8)  & 0xFF)
        out.push(cp & 0xFF)
      } else {
        out.push(cp & 0xFF)
        out.push((cp >>> 8)  & 0xFF)
      }
    }
    return new Uint8Array(out)
  }
}
