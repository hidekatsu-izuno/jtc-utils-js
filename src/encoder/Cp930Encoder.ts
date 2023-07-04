import { Cp930Decoder } from "../decoder/Cp930Decoder.js"
import { PackedMap } from "../PackedMap.js"
import { Encoder } from "./encoder.js"
import { IBMKanjiEncodeMap } from "./IBMKanjiEncodeMap.js"

const EbcdicMap = new PackedMap((m) => {
  const decoder = new Cp930Decoder()

  const buf = new Uint8Array(1)
  for (let b = 0x00; b <= 0xFF; b++) {
    buf[0] = b
    const decoded = decoder.decode(buf)
    if (decoded !== "\uFFFD") {
      m.set(decoded.charCodeAt(0), b)
    }
  }
})

export class Cp930Encoder implements Encoder {
  private fatal

  constructor(options?: { fatal?: boolean }) {
    this.fatal = options?.fatal ?? true
  }

  canEncode(str: string) {
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      let enc: number | undefined
      if ((enc = EbcdicMap.get(cp)) != null) { // EBCDIC
        // no handle
      } else if ((enc = IBMKanjiEncodeMap.get(cp)) != null) {
        // no handle
      } else {
        return false
      }
    }
    return true
  }

  encode(str: string): Uint8Array {
    const out = []
    let shifted = false
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      let fail = false

      let enc: number | undefined
      if ((enc = EbcdicMap.get(cp)) != null) { // EBCDIC
        if (shifted) {
          out.push(0x0F)
          shifted = false
        }
        out.push(enc)
      } else if ((enc = IBMKanjiEncodeMap.get(cp)) != null) {
        if (!shifted) {
          out.push(0x0E)
          shifted = true
        }
        out.push((enc >>> 8) & 0xFF)
        out.push(enc & 0xFF)
      } else {
        fail = true
      }

      if (fail) {
        if (this.fatal) {
          throw TypeError(`The code point ${cp.toString(16)} could not be encoded`)
        } else if (shifted) {
          out.push(0x42) // ？
          out.push(0x6F)
        } else {
          out.push(0x6F) // ?
        }
      }
    }

    if (shifted) {
      out.push(0x0F)
      shifted = false
    }

    return Uint8Array.from(out)
  }
}
