import { promises as fs }  from "node:fs"
import { CsvReader } from "../src/node/CsvReader.js"

const input = await fs.open("./data/cp930.decode.csv")

const reader = new CsvReader(input.createReadStream(), {
  skipEmptyLine: true,
})
try {
  const output = await fs.open("./src/decoder/IBMKanjiDecodeMap.ts", "w")
  try {
    await output.write(`
import { PackedMap } from "../PackedMap.js"

export const IBMKanjiDecodeMap = new PackedMap((m) => {
`.trimStart())
    for await (const line of reader.read()) {
      const ik = line[0]
      const cp = line[1]
      if (ik.length === 4) {
        await output.write(`  m.set(0x${ik}, 0x${cp})\n`)
      }
    }
await output.write(`
})
`.trimStart())
  } catch(err) {
    console.error(err)
  } finally {
    await output.close()
  }
} catch(err) {
  console.error(err)
} finally {
  await reader.close()
}
