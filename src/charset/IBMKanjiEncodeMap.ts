import cp930 from "./cp930.js"
import { PackedMap } from "../PackedMap.js"

export const IBMKanjiEncodeMap = new PackedMap((m) => {
  const decoder = cp930.createDecoder({ fatal: false })

  m.set(0xA6, 0x426A)
  m.set(0xA7, 0x446A)
  m.set(0xA8, 0x4460)
  m.set(0xB0, 0x44ED)
  m.set(0xB1, 0x444B)
  m.set(0xB4, 0x4450)
  m.set(0xB6, 0x4379)
  m.set(0xD7, 0x447A)
  m.set(0xF7, 0x447B)
  m.set(0x2014, 0x444A)
  m.set(0x2016, 0x447C)
  m.set(0x2212, 0x4260)
  m.set(0x301C, 0x43A1)
  m.set(0x4fE0, 0x52EC)
  m.set(0x525D, 0x5481)
  m.set(0x555E, 0x54D4)
  m.set(0x5699, 0x547D)
  m.set(0x56CA, 0x5190)
  m.set(0x5861, 0x4F5E)
  m.set(0x5C5B, 0x5443)
  m.set(0x5C62, 0x55C0)
  m.set(0x6414, 0x54A3)
  m.set(0x6451, 0x54CD)
  m.set(0x6522, 0x5B72)
  m.set(0x6805, 0x51F1)
  m.set(0x688E, 0x5BFE)
  m.set(0x6BE1, 0x54D4)
  m.set(0x6D00, 0x5550)
  m.set(0x6F51, 0x54FA)
  m.set(0x7006, 0x5550)
  m.set(0x70FF, 0x52EC)
  m.set(0x7130, 0x53EE)
  m.set(0x7626, 0x54A4)
  m.set(0x79B1, 0x5553)
  m.set(0x7C1E, 0x54CA)
  m.set(0x7E48, 0x60F1)
  m.set(0x7E61, 0x52DA)
  m.set(0x7E6B, 0x5373)
  m.set(0x8141, 0x61B0)
  m.set(0x8346, 0x53b3)
  m.set(0x840A, 0x52C9)
  m.set(0x841D, 0x53E8)
  m.set(0x841F, 0x52A1)
  m.set(0x8523, 0x53F8)
  m.set(0x87EC, 0x53E8)
  m.set(0x881F, 0x52A1)
  m.set(0x8EC0, 0x5353)
  m.set(0x8F91, 0x446E)
  m.set(0x91AC, 0x507F)
  m.set(0x91B1, 0x51FA)
  m.set(0x92CA, 0x547D)
  m.set(0x9830, 0x4EB3)
  m.set(0x9839, 0x66C8)
  m.set(0x985A, 0x55C1)
  m.set(0x9A52, 0x53DA)
  m.set(0x9B7E, 0x53DA)
  m.set(0x9DD7, 0x5464)
  m.set(0x9E7C, 0x4C7D)
  m.set(0x9EB4, 0x5261)
  m.set(0x9EB5, 0x555F)
  m.set(0xF86F, 0x446E)

  const buf = new Uint8Array(4)
  buf[0] = 0x0E
  buf[3] = 0x0F
  for (let hb = 0x40; hb <= 0xFE; hb++) {
    buf[1] = hb
    for (let lb = 0x40; lb <= 0xFE; lb++) {
      buf[2] = lb

      const decoded = decoder.decode(buf)
      if (decoded && decoded !== "\uFFFD") {
        m.set(decoded.charCodeAt(0), hb << 8 | lb)
      }
    }
  }
})