import { promises as fs }  from "node:fs"
import { CsvReader } from "../src/io/node/CsvReader.js"

const input = await fs.open("./data/fullwidth-halfwidth.csv")
const reader = new CsvReader(input, {
  skipEmptyLine: true,
})
try {
const output = await fs.open("./src/text/toFullwidth.ts", "w")
  try {
  await output.write(`const M = new Map<string, string>([\n`)
  for await (const line of reader.read()) {
    if (reader.lineNumber === 1) {
      continue
    }
    const from = line[1].padStart(4, "0").replace(/(.{4})/g, "\\u$1")
    const to = line[0].padStart(4, "0").replace(/(.{4})/g, "\\u$1")
    await output.write(`\t["${from}", "${to}"],\n`)
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
} finally {
  await reader.close()
}

