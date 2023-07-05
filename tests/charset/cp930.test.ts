import { describe, expect, test } from "vitest"
import { CsvReader } from "../../src/node/CsvReader.js"
import fs from "node:fs"
import cp930 from "../../src/charset/cp930.js"

describe('cp930', () => {
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

    const decoder = cp930.createDecoder()
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

  test("compare cp930 encoder output", async () => {
    const map = new Map()
    const reader = new CsvReader(fs.createReadStream(__dirname + "/../../data/cp930.encode.csv"))
    try {
      for await (const line of reader.read()) {
        map.set(Number.parseInt(line[0], 16), Number.parseInt(line[1], 16))
      }
    } finally {
      await reader.close()
    }

    const encoder = cp930.createEncoder()
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
