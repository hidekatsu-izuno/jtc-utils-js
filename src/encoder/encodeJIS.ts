const M = new Map<number, Uint16Array | Uint32Array>()

function setMap(cp: number, jis: number) {
  const key1 = cp >>> 4
  const key2 = cp & 0xF

  let array = M.get(key1) as any
  if (!array) {
    array = [0]
    M.set(key1, array)
  }
  if (!array[key2 + 1]) {
    array[0] = array[0] | (1 << (15 - key2))
    array[key2 + 1] = jis
  }
}

function initMap() {
  const eucDecoder = new TextDecoder("euc-jp")
  const sjisDecoder = new TextDecoder("shift_jis")

  let buf = new Uint8Array(2)
  for (let hb = 0xA1; hb <= 0xF4; hb++) {
    buf[0] = hb
    for (let lb = 0xA1; lb <= 0xFE; lb++) {
      buf[1] = lb

      const decoded = eucDecoder.decode(buf)
      if (decoded !== "\uFFFD") {
        setMap(decoded.charCodeAt(0), (hb - 0x80) << 8 | (lb - 0x80))
      }
    }
  }

  // Additional Unicode mapping
  setMap(0xA5, 0x0100005C)
  setMap(0xAB, 0x010081E1)
  setMap(0xAC, 0x010081CA)
  setMap(0xAF, 0x01008150)
  setMap(0xB5, 0x010083CA)
  setMap(0xB7, 0x01008145)
  setMap(0xB8, 0x01008143)
  setMap(0xBB, 0x010081E2)
  setMap(0x203E, 0x0100007E)

  // Shift-JIS additional mapping
  buf = new Uint8Array(2)
  for (const hba of [[0xFA, 0xFC], [0xED, 0xEE]]) {
    for (let hb = hba[0]; hb <= hba[1]; hb++) {
      buf[0] = hb
      for (const lba of [[0x40, 0x7E], [0x80, 0xFC]]) {
        for (let lb = lba[0]; lb <= lba[1]; lb++) {
          buf[1] = lb

          const decoded = sjisDecoder.decode(buf)
          if (decoded !== "\uFFFD") {
            const cp = decoded.charCodeAt(0)
            if (cp) {
              setMap(decoded.charCodeAt(0), 0x02000000 | hb << 8 | lb)
            }
          }
        }
      }
    }
  }

  // EUC-JP additional mapping
  buf = new Uint8Array(3)
  buf[0] = 0x8F
  for (const hba of [[0xA1, 0xAB], [0xB0, 0xED], [0xF3, 0xF4]]) {
    for (let hb = hba[0]; hb <= hba[1]; hb++) {
      buf[1] = hb
      for (let lb = 0xA1; lb <= 0xFE; lb++) {
        buf[2] = lb

        const decoded = eucDecoder.decode(buf)
        if (decoded !== "\uFFFD") {
          setMap(decoded.charCodeAt(0), 0x03000000 | 0x8F << 16 | hb << 8 | lb)
        }
      }
    }
  }

  for (const [key, value] of M.entries()) {
    let over = false
    const filtered = value.filter((item?: number) => {
      if (item != null) {
        if ((item & 0xFFFF0000) !== 0) {
          over = true
        }
        return true
      }
      return false
    })
    M.set(key, over ? new Uint32Array(filtered) : new Uint16Array(filtered))
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

export function encodeJIS(cp: number) {
  if (M.size === 0) {
    initMap()
  }

  const key1 = cp >>> 4
  const key2 = cp & 0xF
  const array = M.get(key1)
  if (array) {
    const shifted = array[0] >>> (15 - key2)
    if ((shifted & 0x1) !== 0) {
      return array[bitcount(shifted)]
    }
  }
}
