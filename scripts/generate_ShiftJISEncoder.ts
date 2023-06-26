import { promises as fs }  from "node:fs"
import { CsvReader } from "../src/node/CsvReader.js"

const CONVERT_MAP = new Array<{
  unicode: number,
  win31j: number,
}>()

const input = await fs.open("./data/windows-31j.csv")
const reader = new CsvReader(input)
for await (const item of reader.read()) {
  if (reader.lineNumber === 1 || item.length < 2) {
    continue
  }
  const unicode = Number.parseInt(item[0], 16)
  const win31j = Number.parseInt(item[1], 16)
  if (unicode <= 0x7F || (unicode >= 0xE000 && unicode <= 0xE757) || (unicode >= 0xFF61 && unicode <= 0xFF9F)) {
    continue
  }


}



