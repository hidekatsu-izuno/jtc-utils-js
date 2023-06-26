import { Encoder } from "./encoder.js"

const MAP = (function() {
  const map = new Map()

  const buf = new Uint8Array(2)
  const decoder = new TextDecoder("shift_jis")
  for (let hb = 0x81; hb <= 0x9F; hb++) {
    buf[0] = hb
    for (let lb = 0x40; lb <= 0x7E; lb++) {
      buf[1] = lb
    }
    for (let lb = 0x80; lb <= 0xFC; lb++) {
      buf[1] = lb
    }
  }
  for (let hb = 0xE0; hb <= 0xEF; hb++) {
    buf[0] = hb
    for (let lb = 0x40; lb <= 0x7E; lb++) {
      buf[1] = lb
    }
    for (let lb = 0x80; lb <= 0xFC; lb++) {
      buf[1] = lb
    }
  }
  for (let hb = 0xFA; hb <= 0xFC; hb++) {
    buf[0] = hb
    for (let lb = 0x40; lb <= 0x7E; lb++) {
      buf[1] = lb
    }
    for (let lb = 0x80; lb <= 0xFC; lb++) {
      buf[1] = lb
    }
  }
  return map
})()




export class ShiftJISEncoder implements Encoder {

  get requiredBufferLength(): number {
      return 2
  }

  encode(cp: number, buffer: Uint8Array): number {
    if (cp <= 0x7F) {
      buffer[0] = cp
      return 1
    } else if (cp >= 0xFF61 && cp <= 0xFF9F) {
      buffer[0] = cp - 0xFF61 + 0xA1
      return 1
    } else {

    }
    return 2
  }
}
