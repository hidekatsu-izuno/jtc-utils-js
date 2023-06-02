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

const input = await fs.open("./data/normalize.csv")
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

const output = await fs.open("./src/normalize.ts", "w")
try {
await output.write(`
const M = new Map<string, string>([\n`)
for (const pair of CONVERT_MAP) {
  await output.write(`\t["${pair.from}", "${pair.to}"],\n`)
}
await output.write(`])

export function normalize<T>(value: T): T extends string ? string : T extends null | undefined ?null {
  if (!value) {
    return null
  }

  return value.replace(/(\\r\\n?|.[\\u3099\\u309A])/g, m => M.get(m) ?? m)
}
`)
} finally {
  await output.close()
}

