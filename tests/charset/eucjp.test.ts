import { describe, expect, test } from "vitest"
import fs from "node:fs"
import { CsvReader } from "../../src/CsvReader"
import { eucjp } from "../../src/charset/eucjp"

describe("eucjp", () => {
  test("compare euc-jp encoder output", async () => {
    const map = new Map()
    const reader = new CsvReader(fs.createReadStream(__dirname + "/../../data/encode.euc-jp.csv"))
    try {
      for await (const line of reader) {
        map.set(Number.parseInt(line[0], 16), Number.parseInt(line[1], 16))
      }
    } finally {
      await reader.close()
    }

    const encoder = eucjp.createEncoder()
    for (let i = 0; i < 65536; i++) {
      const c = String.fromCharCode(i)
      const expected = map.get(i)

      let actual: number | undefined = undefined
      try {
        const oc = encoder.encode(String.fromCharCode(i))
        actual = oc.length === 4 ? (oc[0] << 24 | oc[1] << 16 | oc[2] << 8 | oc[3])
          : oc.length === 3 ? (oc[0] << 16 | oc[1] << 8 | oc[2])
          : oc.length === 2 ? (oc[0] << 8 | oc[1])
          : oc[0]
      } catch (err) {
        // no handle
      }

      expect([i.toString(16), c, actual?.toString(16)]).toStrictEqual([i.toString(16), c, expected?.toString(16)])
    }
  })
})
