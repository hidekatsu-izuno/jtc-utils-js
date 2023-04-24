import { promises as fs }  from "node:fs"

const CONVERT_MAP = new Array<{
  fullwidth: string,
  halfwidth: string,
}>()

function step(line: string, index: number) {
  const m = line.split(/,/g)
  if (index === 0 || m.length < 2) {
    return
  }

  CONVERT_MAP.push({
    fullwidth: m[0].replace(/(.{4})/g, "\\u$1"),
    halfwidth: m[1].padStart(4, "0").replace(/(.{4})/g, "\\u$1"),
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

const input = await fs.open("./data/fullwidth-halfwidth.csv")
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

const output = await fs.open("./src/toHalfwidth.tmp.ts", "w")
try {
await output.write(`
export function toHalfwidth(value?: string) {
  if (!value) {
    return value
  }

  let result = ""
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i)
    result += toHalfwidthChar(c)
  }
  return result
}

const M = new Map<string, string>([\n`)
for (const pair of CONVERT_MAP) {
  await output.write(`\t["${pair.fullwidth}", "${pair.halfwidth}"],\n`)
}
await output.write(`])

function toHalfwidthChar(c: string) {
  return M.get(c) ?? c
}
`)
} finally {
  await output.close()
}

