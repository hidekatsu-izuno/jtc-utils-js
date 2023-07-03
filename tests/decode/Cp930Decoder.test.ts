import { describe, expect, test } from "vitest"
import { Cp930Decoder } from "../../src/decoder/Cp930Decoder.js"
import { CsvReader } from "../../src/node/CsvReader.js"
import fs from "node:fs"

describe('Cp930Decoder', () => {
  test("compare cp930 decoder output", async () => {
    const map = new Map<number, number>()
    const reader = new CsvReader(fs.createReadStream(__dirname + "/../../data/cp930.decode.csv"))
    try {
      for await (const line of reader.read()) {
        map.set(Number.parseInt(line[0], 16), Number.parseInt(line[1], 16))
      }
    } finally {
      await reader.close()
    }

    const decoder = new Cp930Decoder()
    for (let i = 0x00; i <= 0xFF; i++) {
      const expected = map.get(i)

      let actual
      try {
        const enc = decoder.decode(Uint8Array.of(i))
        actual = enc.length === 1 ? enc.charCodeAt(0) : undefined
      } catch (err) {
        // no handle
      }
      expect([i.toString(16), actual?.toString(16)]).toStrictEqual([i.toString(16), expected?.toString(16)])
    }

    for (let i = 0x4040; i <= 0xFFFF; i++) {
      const expected = map.get(i)

      let actual
      try {
        const enc = decoder.decode(Uint8Array.of(0x0E, (i >>> 8) & 0xFF, i & 0xFF, 0x0F))
        actual = enc.length === 1 ? enc.charCodeAt(0) : undefined
      } catch (err) {
        // no handle
      }
      expect([i.toString(16), actual?.toString(16)]).toStrictEqual([i.toString(16), expected?.toString(16)])
    }
  })
})
