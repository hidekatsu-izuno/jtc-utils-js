import { Cp939Decoder } from "@/decoder/Cp939Decoder.js"
import { PackedMap } from "../PackedMap.js"

export const IBMKanjiEncodeMap = new PackedMap((m) => {
  const decoder = new Cp939Decoder()

  const buf = new Uint8Array(2)
  for (let hb = 0x40; hb <= 0xFE; hb++) {
    buf[0] = hb
    for (let lb = 0x40; lb <= 0xFE; lb++) {
      buf[1] = lb

      const decoded = decoder.decode(buf)
      if (decoded !== "\uFFFD") {
        m.set(decoded.charCodeAt(0), hb << 8 | lb)
      }
    }
  }
})
