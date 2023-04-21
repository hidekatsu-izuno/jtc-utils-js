import { promises as fs }  from "node:fs"

const WIN31J_MAP = new Array<{
  unicode: number,
  win31j: number,
}>()

function step(line: string, index: number) {
  const m = line.split(/,/g)
  if (index === 0 || m.length !== 2) {
    return
  }

  WIN31J_MAP.push({
    unicode: Number.parseInt(m[0], 16),
    win31j: Number.parseInt(m[1], 16),
  })
}

function toHex32(num: number) {
  const high = (num >>> 16) & 0xFFFF
  const low = num & 0xFFFF
  if (high > 0) {
    return high.toString(16) + low.toString(16).padStart(4, '0')
  }
  return low.toString(16)
}

const input = await fs.open("./data/windows-31j.csv")
try {
  let index = 0
  let buf = ""
  for await (const chunk of input.createReadStream({
    encoding: "utf-8"
  })) {
    buf = buf ? buf + chunk : chunk
    let start = 0
    let pos = 0
    while ((pos = buf.indexOf("\n", start)) != -1) {
      if (buf.charAt(pos - 1) === "\r") {
        step(buf.substring(start, pos - 1), index++)
      } else {
        step(buf.substring(start, pos), index++)
      }
      start = pos + 1
    }
    if (start < buf.length) {
      buf = buf.substring(start)
    } else {
      buf = ""
    }
  }
  if (buf) {
    step(buf, index++)
  }
} finally {
  await input.close()
}

const root = new Map<number, Map<number, number>>()
for (const pair of WIN31J_MAP) {
  /*if (pair.unicode < 0x20 && pair.unicode != 0x09 && pair.unicode != 0x0A && pair.unicode != 0x0D) {
    continue
  } else */if ((pair.unicode >= 0xe000 && pair.unicode <= 0xf8ff)) {
    continue
  }

  const pos0 = (pair.unicode & 0b111111_00000_00000) >>> 10
  const pos1 = (pair.unicode & 0b000000_11111_00000) >>> 5
  const pos2 = (pair.unicode & 0b000000_00000_11111)
  let map = root.get(pos0)
  if (!map) {
    map = new Map<number, number>()
    root.set(pos0, map)
  }
  map.set(pos1, (map.get(pos1) ?? 0) | (1 << (31 - pos2)))
}

const output = await fs.open("./src/isSafeWindows31J.ts", "w")
try {
await output.write(`export function isSafeWindows31J(value: any) {
  if (!value || typeof value !== "string") {
      return false
  }

  for (let i = 0; i < value.length; i++) {
      const n = value.codePointAt(i);
      if (!isWindows31JChar(n)) {
          return false
      }
  }
  return true
}\n\n`)

await output.write(`const M = new Map<number, number>([\n`)
let start = 0;
for (const [key, map] of root) {
  await output.write(`  [${key}, ${start}],\n`)
  start += 1 + map.size
}
await output.write(`])\n\n`)

await output.write(`const A = new Uint32Array([\n`)
for (const [key, map] of root) {
  let pattern = 0;
  for (let pos = 0; pos < 32; pos++) {
      if (map.has(pos)) {
          pattern = pattern | (1 << (31 - pos));
      }
  }
  await output.write(`/*===*/\n`)
  await output.write(`  0x${toHex32(pattern)},\n`)
  const skeys = Array.from(map.keys()).sort((a, b) => a - b)
  for (const key2 of skeys) {
    await output.write(`  0x${toHex32(map.get(key2) || 0)},\n`);
  }
}
await output.write(`])\n\n`)

await output.write(`function isWindows31JChar(n?: number) {
  if (n == null) {
    return false
  }

  const b0 = (n & 0b111111_00000_00000) >>> 10
  const b1 = (n & 0b000000_11111_00000) >>> 5
  const b2 = (n & 0b000000_00000_11111)

  const pos0 = M.get(b0)
  if (pos0 != null) {
    const pat0 = A[pos0]
    if ((pat0 & (1 << (31 - b1))) !== 0) {
      const pos1 = bitcount(pat0 >>> (31 - b1))
      if (pos1 !== 0) {
        const pat1 = A[pos0 + pos1]
        return (pat1 & (1 << (31 - b2))) !== 0
      }
    }
  }

  if (n >= 0xE000 && n <= 0xE757) /* User defined characters */ {
    return true
  }

  return false
}

function bitcount(n: number) {
  n = n - ((n >>> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
  n = (n + (n >>> 4)) & 0x0f0f0f0f;
  n = n + (n >>> 8);
  n = n + (n >>> 16);
  return n & 0x3f;
}
`)
} finally {
  await output.close()
}
