import { PackedMap } from "../util/PackedMap.ts";

export const JISEncodeMap = new PackedMap((m) => {
  const decoder = new TextDecoder("euc-jp");

  m.set(0xa2, 0x2171);
  m.set(0xa3, 0x2172);
  m.set(0xac, 0x224c);
  m.set(0x2014, 0x213d);
  m.set(0x2016, 0x2142);

  const buf = new Uint8Array(2);
  for (let hb = 0xa1; hb <= 0xf4; hb++) {
    buf[0] = hb;
    for (let lb = 0xa1; lb <= 0xfe; lb++) {
      buf[1] = lb;

      const decoded = decoder.decode(buf);
      if (decoded !== "\uFFFD") {
        m.set(decoded.charCodeAt(0), ((hb - 0x80) << 8) | (lb - 0x80));
      }
    }
  }
});
