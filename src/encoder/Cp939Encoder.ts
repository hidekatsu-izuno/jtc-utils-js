import { Encoder } from "./encoder.js"

const EBCDIC = []

export class Cp939Encoder implements Encoder {
  private fatal

  constructor(options?: { fatal?: boolean }) {
    this.fatal = options?.fatal ?? true
  }

  canEncode(str: string) {
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      if (cp <= 0x7F) { // ASCII
      } else {
      }
    }
    return true
  }

  encode(str: string): Uint8Array {
    const out = new Uint8Array(str.length * 2)
    let pos = 0
    for (let i = 0; i < str.length; i++) {
    }
    return out.subarray(0, pos)
  }
}
