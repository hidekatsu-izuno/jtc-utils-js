import { describe, expect, test } from "vitest"
import { ShiftJISEncoder } from "../../src/encoder/ShiftJISEncoder"
import { ShiftJISEncoder2 } from "../../src/encoder/ShiftJISEncoder2"

describe('ShiftJISEncoder', () => {
  test("compare old or new encoder", async () => {
    const oldEncoder = new ShiftJISEncoder({fatal:false})
    const newEncoder = new ShiftJISEncoder2({fatal:false})

    for (let i = 0; i < 65536; i++) {
      const c = String.fromCharCode(i)
      const oc = oldEncoder.encode(c)
      const nc = newEncoder.encode(c)

      expect([i.toString(16), c, nc]).toStrictEqual([i.toString(16), c, oc])
    }
  })
})
