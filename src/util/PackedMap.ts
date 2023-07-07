export interface PackedMapSetter {
  set(key: number, value: number): void
}

export class PackedMap {
  private map = new Map<number, Uint16Array | Uint32Array>()
  private init?: (setter: PackedMapSetter) => void

  constructor(init: (setter: PackedMapSetter) => void) {
    this.init = init
  }

  initialize() {
    if (!this.init) {
      return
    }

    const map = new Map<number, number[]>()

    this.init(<PackedMapSetter> {
      set(key: number, value: number) {
        const key1 = key >>> 4
        const key2 = key & 0xF

        let array = map.get(key1)
        if (!array) {
          array = [0]
          map.set(key1, array)
        }
        if (!array[key2 + 1]) {
          array[0] = array[0] | (1 << (15 - key2))
          array[key2 + 1] = value
        }
      }
    })

    for (const [key, value] of map.entries()) {
      let max = 2
      const filtered = value.filter((item?: number) => {
        if (item != null) {
          if ((item & 0xFFFF0000) !== 0) {
            max = Math.max(max, 4)
          }
          return true
        }
        return false
      })
      this.map.set(key, max === 2 ? new Uint16Array(filtered)
        : new Uint32Array(filtered)
      )
    }

    this.init = undefined
  }

  get(key: number): number | undefined {
    this.initialize()

    const key1 = key >>> 4
    const key2 = key & 0xF
    const array = this.map?.get(key1)
    if (array) {
      const shifted = array[0] >>> (15 - key2)
      if ((shifted & 0x1) !== 0) {
        return array[bitcount(shifted)]
      }
    }
  }

  get size(): number {
    return this.map?.size ?? 0
  }
}

function bitcount(n: number) {
  n = n - ((n >>> 1) & 0x55555555)
  n = (n & 0x33333333) + ((n >>> 2) & 0x33333333)
  n = (n + (n >>> 4)) & 0x0f0f0f0f
  n = n + (n >>> 8)
  n = n + (n >>> 16)
  return n & 0x3f
}
