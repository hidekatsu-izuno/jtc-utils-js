import { PackedMap } from "../PackedMap.js"
import { Encoder, EncoderEncodeOptions } from "./encoder.js"
import { JISEncodeMap } from "./JISEncodeMap.js"

const EucJPMap = new PackedMap((m) => {
  const decoder = new TextDecoder("euc-jp")
  // EUC-JP additional mapping
  m.set(0xA5, 0x5C)
  m.set(0x203E, 0x7E)
  m.set(0x2170, 0x8FF3F3)
  m.set(0x2171, 0x8FF3F4)
  m.set(0x2172, 0x8FF3F5)
  m.set(0x2173, 0x8FF3F6)
  m.set(0x2174, 0x8FF3F7)
  m.set(0x2175, 0x8FF3F8)
  m.set(0x2176, 0x8FF3F9)
  m.set(0x2177, 0x8FF3FA)
  m.set(0x2178, 0x8FF3FB)
  m.set(0x2179, 0x8FF3FC)
  m.set(0x2212, 0xA1DD)
  m.set(0x2225, 0xA1C2)
  m.set(0x301C, 0xA1C1)
  const buf = new Uint8Array(3)
  buf[0] = 0x8F
  for (const hba of [[0xA1, 0xAB], [0xB0, 0xED], [0xF3, 0xF4]]) {
    for (let hb = hba[0]; hb <= hba[1]; hb++) {
      buf[1] = hb
      for (let lb = 0xA1; lb <= 0xFE; lb++) {
        buf[2] = lb

        const decoded = decoder.decode(buf)
        if (decoded !== "\uFFFD") {
          m.set(decoded.charCodeAt(0), 0x8F << 16 | hb << 8 | lb)
        }
      }
    }
  }
})

export class EucJPEncoder implements Encoder {
  private fatal

  constructor(options?: { fatal?: boolean }) {
    this.fatal = options?.fatal ?? true
  }

  canEncode(str: string, options?: EncoderEncodeOptions) {
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      if (cp <= 0x7F) { // ASCII
        // no handle
      } else if (cp >= 0xFF61 && cp <= 0xFF9F) { // 半角カナ
        // no handle
      } else {
        let jis = JISEncodeMap.get(cp)
        if (jis != null) {
          // no handle
        } else if ((jis = EucJPMap.get(cp)) != null) {
          // no handle
        } else {
          return false
        }
      }
    }
    return true
  }

  encode(str: string, options?: EncoderEncodeOptions): Uint8Array {
    const out = []
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      if (cp <= 0x7F) { // ASCII
        out.push(cp)
      } else if (cp >= 0xFF61 && cp <= 0xFF9F) { // 半角カナ
        out.push(0x8E)
        out.push(cp - 0xFF61 + 0xA1)
      } else {
        let jis = JISEncodeMap.get(cp)
        if (jis != null) {
          out.push(((jis >>> 8) + 0x80) & 0xFF)
          out.push((jis + 0x80) & 0xFF)
        } else if ((jis = EucJPMap.get(cp)) != null) {
          if (jis > 0xFFFF) {
            out.push((jis >>> 16) & 0xFF)
            out.push((jis >>> 8) & 0xFF)
            out.push(jis & 0xFF)
          } else if (jis > 0xFF) {
            out.push((jis >>> 8) & 0xFF)
            out.push(jis & 0xFF)
          } else {
            out.push(jis & 0xFF)
          }
        } else if (this.fatal) {
          throw TypeError(`The code point ${cp.toString(16)} could not be encoded`)
        } else {
          out.push(0x5F) // ?
        }
      }
    }
    return Uint8Array.from(out)
  }
}
