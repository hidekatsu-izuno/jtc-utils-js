import { PackedMap } from "../PackedMap.js"
import { Encoder } from "./encoder.js"
import { JISEncodeMap } from "./JISEncodeMap.js"

const ShiftJISMap = new PackedMap((m) => {
  const decoder = new TextDecoder("shift_jis")

  // Shift-JIS additional mapping
  m.set(0xA5, 0x5C)
  m.set(0xAB, 0x81E1)
  m.set(0xAF, 0x8150)
  m.set(0xB5, 0x83CA)
  m.set(0xB7, 0x8145)
  m.set(0xB8, 0x8143)
  m.set(0xBB, 0x81E2)
  m.set(0x203E, 0x7E)
  m.set(0x2212, 0x817C)
  m.set(0x3094, 0x8394)
  const buf = new Uint8Array(2)
  for (const hba of [[0xFA, 0xFC], [0xED, 0xEE]]) {
    for (let hb = hba[0]; hb <= hba[1]; hb++) {
      buf[0] = hb
      for (const lba of [[0x40, 0x7E], [0x80, 0xFC]]) {
        for (let lb = lba[0]; lb <= lba[1]; lb++) {
          buf[1] = lb

          const decoded = decoder.decode(buf)
          if (decoded !== "\uFFFD") {
            m.set(decoded.charCodeAt(0), hb << 8 | lb)
          }
        }
      }
    }
  }
})

export class ShiftJISEncoder implements Encoder {
  private fatal

  constructor(options?: { fatal?: boolean }) {
    this.fatal = options?.fatal ?? true

    JISEncodeMap.initialize()
    ShiftJISMap.initialize()
  }

  canEncode(str: string) {
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      if (cp <= 0x7F) { // ASCII
        // no handle
      } else if (cp >= 0xE000 && cp <= 0xE757) { // ユーザー外字
        // no handle
      } else if (cp >= 0xFF61 && cp <= 0xFF9F) { // 半角カナ
        // no handle
      } else {
        let enc = JISEncodeMap.get(cp)
        if (enc != null) {
          // no handle
        } else if ((enc = ShiftJISMap.get(cp)) != null) {
          // no handle
        } else {
          return false
        }
      }
    }
    return true
  }

  encode(str: string): Uint8Array {
    const out = new Uint8Array(str.length * 2)
    let pos = 0
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      if (cp <= 0x7F) { // ASCII
        out[pos++] = cp
      } else if (cp >= 0xE000 && cp <= 0xE757) { // ユーザー外字
        const sjis = (cp >= 0xE6DB) ? cp - 0xE6DB + 0xF980
          : (cp >= 0xE69C) ? cp - 0xE69C + 0xF940
          : (cp >= 0xE61F) ? cp - 0xE61F + 0xF880
          : (cp >= 0xE5E0) ? cp - 0xE5E0 + 0xF840
          : (cp >= 0xE563) ? cp - 0xE563 + 0xF780
          : (cp >= 0xE524) ? cp - 0xE524 + 0xF740
          : (cp >= 0xE4A7) ? cp - 0xE4A7 + 0xF680
          : (cp >= 0xE468) ? cp - 0xE468 + 0xF640
          : (cp >= 0xE3EB) ? cp - 0xE3EB + 0xF580
          : (cp >= 0xE3AC) ? cp - 0xE3AC + 0xF540
          : (cp >= 0xE32F) ? cp - 0xE32F + 0xF480
          : (cp >= 0xE2F0) ? cp - 0xE2F0 + 0xF440
          : (cp >= 0xE273) ? cp - 0xE273 + 0xF380
          : (cp >= 0xE234) ? cp - 0xE234 + 0xF340
          : (cp >= 0xE1B7) ? cp - 0xE1B7 + 0xF280
          : (cp >= 0xE178) ? cp - 0xE178 + 0xF240
          : (cp >= 0xE0FB) ? cp - 0xE0FB + 0xF180
          : (cp >= 0xE0BC) ? cp - 0xE0BC + 0xF140
          : (cp >= 0xE03F) ? cp - 0xE03F + 0xF080
          : cp - 0xE000 + 0xF040
        out[pos++] = (sjis >>> 8) & 0xFF
        out[pos++] = sjis & 0xFF
      } else if (cp >= 0xFF61 && cp <= 0xFF9F) { // 半角カナ
        out[pos++] = cp - 0xFF61 + 0xA1
      } else {
        let enc = JISEncodeMap.get(cp)
        if (enc != null) {
          let hb = (enc >>> 8) & 0xFF
          let lb = enc & 0xFF
          lb += (hb & 1) ? (lb < 0x60) ? 0x1F : 0x20 : 0x7E
          hb = (hb < 0x5F) ? ((hb + 0xE1) >>> 1) : ((hb + 0x161) >>> 1)
          out[pos++] = hb
          out[pos++] = lb
        } else if ((enc = ShiftJISMap.get(cp)) != null) {
          if (enc > 0xFF) {
            out[pos++] = (enc >>> 8) & 0xFF
            out[pos++] = enc & 0xFF
          } else {
            out[pos++] = enc & 0xFF
          }
        } else if (this.fatal) {
          throw TypeError(`The code point ${cp.toString(16)} could not be encoded`)
        } else {
          out[pos++] = 0x5F // ?
        }
      }
    }
    return out.subarray(0, pos)
  }
}
