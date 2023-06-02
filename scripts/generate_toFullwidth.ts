import { promises as fs }  from "node:fs"

const CONVERT_MAP = new Array<{
  from: string,
  to: string,
}>()

function step(line: string, index: number) {
  const m = line.split(/,/g)
  if (index === 0 || m.length < 2) {
    return
  }

  CONVERT_MAP.push({
    from: m[1].padStart(4, "0").replace(/(.{4})/g, "\\u$1"),
    to: m[0].padStart(4, "0").replace(/(.{4})/g, "\\u$1"),
  })
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

const output = await fs.open("./src/toFullwidth.ts", "w")
try {
await output.write(`
const M = new Map<string, string>([\n`)
for (const pair of CONVERT_MAP) {
  await output.write(`\t["${pair.from}", "${pair.to}"],\n`)
}
await output.write(`])

function toFullwidthChar(c: string) {
  return M.get(c) ?? c
}

export function toFullwidth(str: string): string;
export function toFullwidth(str: null): null;
export function toFullwidth(str: undefined): undefined;
export function toFullwidth(value: string | null | undefined) {
  if (!value) {
    return value
  }

  let result = ""
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i)
    if (i + 1 < value.length) {
      const c2 = value.charAt(i+1)
      if (c2 === "\\uFF9E" || c2 === "\\uFF9F") {
        result += toFullwidthChar(c + c2)
        i++
        continue
      }
    }
    result += toFullwidthChar(c)
  }
  return result
}
`)
} finally {
  await output.close()
}

