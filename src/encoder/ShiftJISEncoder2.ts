import { Encoder } from "./encoder.js"
import { encodeJIS } from "./encodeJIS.js"

export class ShiftJISEncoder2 implements Encoder {
  private fatal

  constructor(options?: { fatal?: boolean }) {
    this.fatal = options?.fatal ?? true
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
        const jis = encodeJIS(cp) ?? 0xFF000000
        const plane = (jis >>> 24)
        if (plane === 0) {
          // no handle
        } else if (plane === 1) {
          // no handle
        } else if (plane === 2) {
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
        const jis = encodeJIS(cp) ?? 0xFF000000
        const plane = (jis >>> 24)
        if (plane === 0) {
          let hb = (jis >>> 8) & 0xFF
          let lb = jis & 0xFF
          lb += (hb & 1) ? (lb < 0x60) ? 0x1F : 0x20 : 0x7E
          hb = (hb < 0x5F) ? ((hb + 0xE1) >>> 1) : ((hb + 0x161) >>> 1)
          out[pos++] = hb
          out[pos++] = lb
        } else if (plane === 1 || plane === 2) {
          out[pos++] = (jis >>> 8) & 0xFF
          out[pos++] = jis & 0xFF
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
