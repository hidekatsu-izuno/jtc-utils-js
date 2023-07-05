import { PackedMap } from "../PackedMap.js"

export const JISEncodeMap = new PackedMap((m) => {
  const decoder = new TextDecoder("euc-jp")

  m.set(0xA2, 0x2171)
  m.set(0xA3, 0x2172)
  m.set(0xAC, 0x224C)
  m.set(0x2014, 0x213D)
  m.set(0x2016, 0x2142)

  const buf = new Uint8Array(2)
  for (let hb = 0xA1; hb <= 0xF4; hb++) {
    buf[0] = hb
    for (let lb = 0xA1; lb <= 0xFE; lb++) {
      buf[1] = lb

      const decoded = decoder.decode(buf)
      if (decoded !== "\uFFFD") {
        m.set(decoded.charCodeAt(0), (hb - 0x80) << 8 | (lb - 0x80))
      }
    }
  }
})
