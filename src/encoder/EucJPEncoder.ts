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
    const out = new Uint8Array(str.length * 3)
    let pos = 0
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      if (cp <= 0x7F) { // ASCII
        out[pos++] = cp
      } else if (cp >= 0xFF61 && cp <= 0xFF9F) { // 半角カナ
        out[pos++] = 0x8E
        out[pos++] = cp - 0xFF61 + 0xA1
      } else {
        let jis = encodeJIS(cp)
        if (jis != null) {
          out[pos++] = ((jis >>> 8) + 0x80) & 0xFF
          out[pos++] = (jis + 0x80) & 0xFF
        } else if ((jis = encodeJIS(0x02000000 | cp)) != null) {
          if (jis > 0xFFFF) {
            out[pos++] = (jis >>> 16) & 0xFF
            out[pos++] = (jis >>> 8) & 0xFF
            out[pos++] = jis & 0xFF
          } else if (jis > 0xFF) {
            out[pos++] = (jis >>> 8) & 0xFF
            out[pos++] = jis & 0xFF
          } else {
            out[pos++] = jis & 0xFF
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
