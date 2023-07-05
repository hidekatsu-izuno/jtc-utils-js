import { Cp930Decoder } from "../decode/Cp930Decoder.js"
import { PackedMap } from "../PackedMap.js"
import { Encoder, EncoderEncodeOptions } from "./encoder.js"
import { IBMKanjiEncodeMap } from "./IBMKanjiEncodeMap.js"

const EbcdicMap = new PackedMap((m) => {
  const decoder = new Cp930Decoder({ fatal: false })

  m.set(0x85, 0x15)

  const buf = new Uint8Array(1)
  for (let b = 0x00; b <= 0xFF; b++) {
    buf[0] = b
    const decoded = decoder.decode(buf)
    if (decoded && decoded !== "\uFFFD") {
      m.set(decoded.charCodeAt(0), b)
    }
  }
})

export class Cp930Encoder implements Encoder {
  private fatal

  constructor(options?: { fatal?: boolean }) {
    this.fatal = options?.fatal ?? true

    EbcdicMap.initialize()
    IBMKanjiEncodeMap.initialize()
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

  encode(str: string, options?: EncoderEncodeOptions): Uint8Array {
    const out = []
    let shift = options?.shift ?? false
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      let enc: number | undefined
      if ((enc = EbcdicMap.get(cp)) != null) { // EBCDIC
        if (shift) {
          out.push(0x0F)
          shift = false
        }
        out.push(enc)
      } else if ((enc = IBMKanjiEncodeMap.get(cp)) != null) {
        if (!shift) {
          out.push(0x0E)
          shift = true
        }
        out.push((enc >>> 8) & 0xFF)
        out.push(enc & 0xFF)
      } else {
        if (this.fatal) {
          throw TypeError(`The code point ${cp.toString(16)} could not be encoded`)
        } else if (shift) {
          out.push(0x42) // ？
          out.push(0x6F)
        } else {
          out.push(0x6F) // ?
        }
      }
    }

    if (shift) {
      out.push(0x0F)
      shift = false
    }

    return Uint8Array.from(out)
  }
}
