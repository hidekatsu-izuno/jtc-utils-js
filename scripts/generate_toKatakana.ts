import { promises as fs }  from "node:fs"
import { CsvReader } from "../src/io/node/CsvReader.js"

const input = await fs.open("./data/hiragana-katakana.csv")
const reader = new CsvReader(input, {
  skipEmptyLine: true,
})
try {
  const output = await fs.open("./src/text/toKatakana.ts", "w")
  try {
    await output.write(`const M = new Map<string, string>([\n`)
    for await (const line of reader.read()) {
      if (reader.lineNumber === 1) {
        continue
      }
      const from = line[0].padStart(4, "0").replace(/(.{4})/g, "\\u$1")
      const to = line[1].padStart(4, "0").replace(/(.{4})/g, "\\u$1")
      await output.write(`\t["${from}", "${to}"],\n`)
    }
    await output.write(`])

function toKatakanaChar(c: string) {
  return M.get(c) ?? c
}

export function toKatakana(str: string): string;
export function toKatakana(str: null): null;
export function toKatakana(str: undefined): undefined;
export function toKatakana(value: string | null | undefined) {
  if (!value) {
    return value
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
`)
  } finally {
    await output.close()
  }
} finally {
await reader.close()
}
