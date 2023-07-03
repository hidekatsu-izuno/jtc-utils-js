import { describe, expect, test } from "vitest"
import { EucJPEncoder } from "../../src/encoder/EucJPEncoder"
import { CsvReader } from "../../src/node/CsvReader"
import fs from "node:fs"

describe('EucJPJISEncoder', () => {
  test("compare euc-jp encoder output", async () => {
    const reader = new CsvReader(fs.createReadStream(__dirname + "/../data/euc-jp.encode.csv"))
    const map = new Map()
    for await (const line of reader.read()) {
      map.set(Number.parseInt(line[0], 16), Number.parseInt(line[1], 16))
    }
    reader.close()

    const encoder = new EucJPEncoder()
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
