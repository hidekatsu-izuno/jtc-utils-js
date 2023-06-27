import { Encoder } from "./encoder.js"
import { encodeJIS } from "./encodeJIS.js"

export class EucJPEncoder implements Encoder {
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
      } else if (cp >= 0xE000 && cp <= 0xE3AB) { // ユーザー外字（前半）
        const euc = (cp >= 0xE32F) ? cp - 0xE32F + 0xFEA1
          : (cp >= 0xE2F0) ? cp - 0xE2F0 + 0xFDA1
          : (cp >= 0xE273) ? cp - 0xE273 + 0xFCA1
          : (cp >= 0xE234) ? cp - 0xE234 + 0xFBA1
          : (cp >= 0xE1B7) ? cp - 0xE1B7 + 0xFAA1
          : (cp >= 0xE178) ? cp - 0xE178 + 0xF9A1
          : (cp >= 0xE0FB) ? cp - 0xE0FB + 0xF8A1
          : (cp >= 0xE0BC) ? cp - 0xE0BC + 0xF7A1
          : (cp >= 0xE03F) ? cp - 0xE03F + 0xF6A1
          : cp - 0xE000 + 0xF5A1
        out[pos++] = (euc >>> 8) & 0xFF
        out[pos++] = euc & 0xFF
      } else if (cp >= 0xE3AC && cp <= 0xE757) { // ユーザー外字（後半）
        const euc = (cp >= 0xE6DB) ? cp - 0xE6DB + 0x8FFEA1
        : (cp >= 0xE69C) ? cp - 0xE69C + 0x8FFDA1
        : (cp >= 0xE61F) ? cp - 0xE61F + 0x8FFCA1
        : (cp >= 0xE5E0) ? cp - 0xE5E0 + 0x8FFBA1
        : (cp >= 0xE563) ? cp - 0xE563 + 0x8FFAA1
        : (cp >= 0xE524) ? cp - 0xE524 + 0x8FF9A1
        : (cp >= 0xE4A7) ? cp - 0xE4A7 + 0x8FF8A1
        : (cp >= 0xE468) ? cp - 0xE468 + 0x8FF7A1
        : (cp >= 0xE3EB) ? cp - 0xE3EB + 0x8FF6A1
        : cp - 0xE3AC + 0x8FF5A1
        out[pos++] = (euc >>> 16) & 0xFF
        out[pos++] = (euc >>> 8) & 0xFF
        out[pos++] = euc & 0xFF
      } else if (cp >= 0xFF61 && cp <= 0xFF9F) { // 半角カナ
        out[pos++] = 0x8E
        out[pos++] = cp - 0xFF61 + 0xA1
      } else {
        const jis = encodeJIS(cp) ?? 0xFF000000
        const plane = (jis >>> 24)
        if (plane === 0) {
          out[pos++] = ((jis >>> 8) + 0x80) & 0xFF
          out[pos++] = (jis + 0x80) & 0xFF
        } else if (plane === 3) {
          out[pos++] = (jis >>> 16) & 0xFF
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
