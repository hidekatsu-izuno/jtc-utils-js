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
    from: m[0].padStart(4, "0").replace(/(.{4})/g, "\\u$1"),
    to: m[1].padStart(4, "0").replace(/(.{4})/g, "\\u$1"),
  })
}

const input = await fs.open("./data/hiragana-katakana.csv")
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

const output = await fs.open("./src/toKatakana.ts", "w")
try {
await output.write(`
export function toKatakana(value?: string) {
  if (!value) {
    return null
  }

  let result = ""
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i)
    if (i + 1 < value.length) {
      const c2 = value.charAt(i+1)
      if (c2 == "\\u3099" || c2 == "\\u309A") {
        result += toKatakanaChar(c + c2)
        i++
        continue
      }
    }
    result += toKatakanaChar(c)
  }
  return result
}

const M = new Map<string, string>([\n`)
for (const pair of CONVERT_MAP) {
  await output.write(`\t["${pair.from}", "${pair.to}"],\n`)
}
await output.write(`])

function toKatakanaChar(c: string) {
  return M.get(c) ?? c
}
`)
} finally {
  await output.close()
}

