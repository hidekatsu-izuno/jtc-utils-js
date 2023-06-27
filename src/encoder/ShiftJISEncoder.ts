import { Encoder } from "./encoder.js"

const M = new Map<number, Uint16Array>()

function initM() {
  const decoder = new TextDecoder("shift_jis")
  const buf = new Uint8Array(2)
  for (const hba of [[0x81, 0x81], [0x84, 0x9F], [0xFA, 0xFC], [0xE0, 0xEF]]) {
    for (let hb = hba[0]; hb <= hba[1]; hb++) {
      buf[0] = hb
      for (const lba of [[0x40, 0x7E], [0x80, 0xFC]]) {
        for (let lb = lba[0]; lb <= lba[1]; lb++) {
          buf[1] = lb

          const decoded = decoder.decode(buf)
          if (decoded !== "\uFFFD") {
            const cp = decoded.charCodeAt(0)
            if (cp) {
              setM(cp, buf[0] << 8 | buf[1])
            }
          }
        }
      }
    }
  }
  setM(0xA5, 0x5C)
  setM(0xAB, 0x81E1)
  setM(0xAC, 0x81CA)
  setM(0xAF, 0x8150)
  setM(0xB5, 0x83CA)
  setM(0xB7, 0x8145)
  setM(0xB8, 0x8143)
  setM(0xBB, 0x81E2)
  setM(0x203E, 0x7E)
  for (const [key, value] of M.entries()) {
    M.set(key, new Uint16Array(value.filter((item?: number) => item != null)))
  }
}

function setM(cp: number, sjis: number) {
  const key1 = cp >>> 4
  const key2 = cp & 0xF

  let array = M.get(key1) as any
  if (!array) {
    array = [0]
    M.set(key1, array)
  }
  if (!array[key2 + 1]) {
    array[0] = array[0] | (1 << (15 - key2))
    array[key2 + 1] = sjis
  }
}

function bitcount(n: number) {
  n = n - ((n >>> 1) & 0x55555555)
  n = (n & 0x33333333) + ((n >>> 2) & 0x33333333)
  n = (n + (n >>> 4)) & 0x0f0f0f0f
  n = n + (n >>> 8)
  n = n + (n >>> 16)
  return n & 0x3f
}

export class ShiftJISEncoder implements Encoder {
  private fatal

  constructor(options?: { fatal?: boolean }) {
    if (M.size === 0) {
      initM()
    }
    this.fatal = options?.fatal ?? true
  }

  canEncode(str: string) {
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      if (cp <= 0x7F) {
        // no handle
      } else if (cp >= 0x0391 && cp <= 0x03A1) { // Α～Ρ
        // no handle
      } else if (cp >= 0x03A3 && cp <= 0x03A9) { // Σ～Ω
        // no handle
      } else if (cp >= 0x03B1 && cp <= 0x03C1) { // α～ρ
        // no handle
      } else if (cp >= 0x03C3 && cp <= 0x03C9) { // σ～ω
        // no handle
      } else if (cp >= 0x3041 && cp <= 0x3093) { // ぁ～ん
        // no handle
      } else if (cp >= 0x30A1 && cp <= 0x30F6) { // ァ～ヶ
        // no handle
      } else if (cp >= 0xE000 && cp <= 0xE757) { // ユーザー外字
        // no handle
      } else if (cp >= 0xFF10 && cp <= 0xFF19) { // ０～９
        // no handle
      } else if (cp >= 0xFF21 && cp <= 0xFF3A) { // Ａ～Ｚ
        // no handle
      } else if (cp >= 0xFF41 && cp <= 0xFF5A) { // ａ～ｚ
        // no handle
      } else if (cp >= 0xFF61 && cp <= 0xFF9F) { // 半角カナ
        // no handle
      } else {
        const key1 = cp >>> 4
        const key2 = cp & 0xF
        const array = M.get(key1)
        if (!array || (array[0] & (1 << (15 - key2))) === 0) {
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
      } else if (cp >= 0x0391 && cp <= 0x03A1) { // Α～Ρ
        const sjis = cp - 0x0391 + 0x839F
        out[pos++] = (sjis >>> 8) & 0xFF
        out[pos++] = sjis & 0xFF
      } else if (cp >= 0x03A3 && cp <= 0x03A9) { // Σ～Ω
        const sjis = cp - 0x03A3 + 0x83B0
        out[pos++] = (sjis >>> 8) & 0xFF
        out[pos++] = sjis & 0xFF
      } else if (cp >= 0x03B1 && cp <= 0x03C1) { // α～ρ
        const sjis = cp - 0x03B1 + 0x83BF
        out[pos++] = (sjis >>> 8) & 0xFF
        out[pos++] = sjis & 0xFF
      } else if (cp >= 0x03C3 && cp <= 0x03C9) { // σ～ω
        const sjis = cp - 0x03C3 + 0x83D0
        out[pos++] = (sjis >>> 8) & 0xFF
        out[pos++] = sjis & 0xFF
      } else if (cp >= 0x3041 && cp <= 0x3093) { // ぁ～ん
        const sjis = cp - 0x3041 + 0x829F
        out[pos++] = (sjis >>> 8) & 0xFF
        out[pos++] = sjis & 0xFF
      } else if (cp >= 0x30A1 && cp <= 0x30F6) { // ァ～ヶ
        const sjis = (cp >= 0x30E0) ? cp - 0x30E0 + 0x8380
          : cp - 0x30A1 + 0x8340
          out[pos++] = (sjis >>> 8) & 0xFF
          out[pos++] = sjis & 0xFF
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
      } else if (cp >= 0xFF10 && cp <= 0xFF19) { // ０～９
        const sjis = cp - 0xFF10 + 0x824F
        out[pos++] = (sjis >>> 8) & 0xFF
        out[pos++] = sjis & 0xFF
      } else if (cp >= 0xFF21 && cp <= 0xFF3A) { // Ａ～Ｚ
        const sjis = cp - 0xFF21 + 0x8260
        out[pos++] = (sjis >>> 8) & 0xFF
        out[pos++] = sjis & 0xFF
      } else if (cp >= 0xFF41 && cp <= 0xFF5A) { // ａ～ｚ
        const sjis = cp - 0xFF41 + 0x8281
        out[pos++] = (sjis >>> 8) & 0xFF
        out[pos++] = sjis & 0xFF
      } else if (cp >= 0xFF61 && cp <= 0xFF9F) { // 半角カナ
        out[pos++] = cp - 0xFF61 + 0xA1
      } else {
        const key1 = cp >>> 4
        const key2 = cp & 0xF
        const array = M.get(key1)
        let shifted = 0
        if (array && ((shifted = (array[0] >>> (15 - key2))) & 0x1) !== 0) {
          const sjis = array[bitcount(shifted)]
          out[pos++] = (sjis >>> 8) & 0xFF
          out[pos++] = sjis & 0xFF
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
