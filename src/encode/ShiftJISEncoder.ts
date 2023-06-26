import { Encoder } from "./encoder.js"

const M = new Map()
function setM(cp: number, sjis: number) {
  const key1 = cp >>> 4
  const key2 = cp & 0xF

  let array = M.get(key1)
  if (!array) {
    array = [0]
    M.set(key1, array)
  }
  if (!array[key2 + 1]) {
    array[0] = array[0] | (1 << (15 - key2))
    array[key2 + 1] = sjis
  }
}

const decoder = new TextDecoder("shift_jis")
const buf = new Uint8Array(2)
for (const hba of [[0x81, 0x9F], [0xFA, 0xFC], [0xE0, 0xEF]]) {
  for (let hb = hba[0]; hb <= hba[1]; hb++) {
    buf[0] = hb
    for (const lba of [[0x40, 0x7E], [0x80, 0xFC]]) {
      for (let lb = lba[0]; lb <= lba[1]; lb++) {
        buf[1] = lb

        const decoded = decoder.decode(buf)
        if (decoded !== "\uFFFD") {
          setM(decoded.codePointAt(0) ?? 0, buf[0] << 8 | buf[1])
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
}
for (const key of M.keys()) {
  M.set(key, new Uint16Array(M.get(key).filter((item?: number) => item != null)))
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

  get requiredBufferLength(): number {
      return 2
  }

  canEncode(cp: number) {
    if (cp <= 0x7F) {
      return true
    } else if (cp >= 0xF040 && cp <= 0xF9FC) {
      return true
    } else if (cp >= 0xFF61 && cp <= 0xFF9F) {
      return true
    } else {
      const key1 = cp >>> 4
      const key2 = cp & 0xF
      const array = M.get(key1)
      return array && (array[0] & (1 << (15 - key2))) !== 0
    }
  }

  encode(cp: number, buffer: Uint8Array) {
    if (cp <= 0x7F) {
      buffer[0] = cp
      return 1
    } else if (cp >= 0xF040 && cp <= 0xF9FC) {
      buffer[0] = cp - 0xF040 + 0xE000
      return 1
    } else if (cp >= 0xFF61 && cp <= 0xFF9F) {
      buffer[0] = cp - 0xFF61 + 0xA1
      return 1
    } else {
      const key1 = cp >>> 4
      const key2 = cp & 0xF
      const array = M.get(key1)
      if (array) {
        const sjis = array[bitcount(array[0] >>> (15 - key2)) + 1]
        buffer[0] = (sjis >> 8) & 0xFF
        buffer[1] = sjis & 0xFF
        return 2
      }
      return 0
    }
  }
}
