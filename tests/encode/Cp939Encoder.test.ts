import { describe, expect, test } from "vitest"
import { CsvReader } from "../../src/node/CsvReader"
import fs from "node:fs"
import { Cp939Encoder } from "../../src/encode/Cp939Encoder"

describe('Cp939Encoder', () => {
  test("compare cp939 encoder output", async () => {
    const map = new Map()
    const reader = new CsvReader(fs.createReadStream(__dirname + "/../data/cp939.encode.csv"))
    try {
      for await (const line of reader.read()) {
        map.set(Number.parseInt(line[0], 16), Number.parseInt(line[1], 16))
      }
    } finally {
      await reader.close()
    }

    const encoder = new Cp939Encoder()
    for (let i = 0; i < 65536; i++) {
      const c = String.fromCharCode(i)
      const expected = map.get(i)

      let actual: number | undefined = undefined
      try {
        const enc = encoder.encode(c)
        if (enc.length === 4 && enc[0] === 0x0E && enc[3] === 0x0F) {
          actual = (enc[1] << 8 | enc[2])
        } else if (enc.length === 1) {
          actual = enc[0]
        } else if (enc.length > 0) {
          actual = enc.length === 2 ? (enc[0] << 8 | enc[1]) : enc[0]
        }
      } catch (err) {
        // no handle
      }

      expect([i.toString(16), c, actual?.toString(16)]).toStrictEqual([i.toString(16), c, expected?.toString(16)])
    }
  })
})
