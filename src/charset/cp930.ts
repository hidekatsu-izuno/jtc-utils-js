import { Charset, CharsetDecodeOptions, CharsetDecoder, CharsetDecoderOptions, CharsetEncodeOptions, CharsetEncoder, CharsetEncoderOptions } from "./charset.ts"
import { IBMKanjiDecodeMap } from "./IBMKanjiDecodeMap.ts"
import { IBMKanjiEncodeMap } from "./IBMKanjiEncodeMap.ts"
import { PackedMap } from "../util/PackedMap.ts"

class Cp930Charset implements Charset {
  get name() {
    return "cp930"
  }

  createDecoder(options?: CharsetDecoderOptions) {
    return new Cp930Decoder(options)
  }

  createEncoder(options?: CharsetEncoderOptions) {
    return new Cp930Encoder(options)
  }

  isUnicode() {
    return false
  }

  isEbcdic() {
    return true
  }
}

const EbcdicDecodeMap = Uint16Array.of(
  //   0       1       2       3       4       5       6       7       8       9       A       B       C       D       E       F
  0x0000, 0x0001, 0x0002, 0x0003, 0x009c, 0x0009, 0x0086, 0x007f, 0x0097, 0x008d, 0x008e, 0x000b, 0x000c, 0x000d, 0xFFFD, 0xFFFD, // 0x
  0x0010, 0x0011, 0x0012, 0x0013, 0x009d, 0x000a, 0x0008, 0x0087, 0x0018, 0x0019, 0x0092, 0x008f, 0x001c, 0x001d, 0x001e, 0x001f, // 1x
  0x0080, 0x0081, 0x0082, 0x0083, 0x0084, 0x000a, 0x0017, 0x001b, 0x0088, 0x0089, 0x008a, 0x008b, 0x008c, 0x0005, 0x0006, 0x0007, // 2x
  0x0090, 0x0091, 0x0016, 0x0093, 0x0094, 0x0095, 0x0096, 0x0004, 0x0098, 0x0099, 0x009a, 0x009b, 0x0014, 0x0015, 0x009e, 0x001a, // 3x
  0x0020, 0xff61, 0xff62, 0xff63, 0xff64, 0xff65, 0xff66, 0xff67, 0xff68, 0xff69, 0x00a3, 0x002e, 0x003c, 0x0028, 0x002b, 0x007c, // 4x
  0x0026, 0xff6a, 0xff6b, 0xff6c, 0xff6d, 0xff6e, 0xff6f, 0xFFFD, 0xff70, 0xFFFD, 0x0021, 0x00a5, 0x002a, 0x0029, 0x003b, 0x00ac, // 5x
  0x002d, 0x002f, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065, 0x0066, 0x0067, 0x0068, 0xFFFD, 0x002c, 0x0025, 0x005f, 0x003e, 0x003f, // 6x
  0x005b, 0x0069, 0x006a, 0x006b, 0x006c, 0x006d, 0x006e, 0x006f, 0x0070, 0x0060, 0x003a, 0x0023, 0x0040, 0x0027, 0x003d, 0x0022, // 7x
  0x005d, 0xff71, 0xff72, 0xff73, 0xff74, 0xff75, 0xff76, 0xff77, 0xff78, 0xff79, 0xff7a, 0x0071, 0xff7b, 0xff7c, 0xff7d, 0xff7e, // 8x
  0xff7f, 0xff80, 0xff81, 0xff82, 0xff83, 0xff84, 0xff85, 0xff86, 0xff87, 0xff88, 0xff89, 0x0072, 0xFFFD, 0xff8a, 0xff8b, 0xff8c, // 9x
  0x007e, 0x203e, 0xff8d, 0xff8e, 0xff8f, 0xff90, 0xff91, 0xff92, 0xff93, 0xff94, 0xff95, 0x0073, 0xff96, 0xff97, 0xff98, 0xff99, // Ax
  0x005e, 0x00a2, 0x005c, 0x0074, 0x0075, 0x0076, 0x0077, 0x0078, 0x0079, 0x007a, 0xff9a, 0xff9b, 0xff9c, 0xff9d, 0xff9e, 0xff9f, // Bx
  0x007b, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047, 0x0048, 0x0049, 0xFFFD, 0xFFFD, 0xFFFD, 0xFFFD, 0xFFFD, 0xFFFD, // Cx
  0x007d, 0x004a, 0x004b, 0x004c, 0x004d, 0x004e, 0x004f, 0x0050, 0x0051, 0x0052, 0xFFFD, 0xFFFD, 0xFFFD, 0xFFFD, 0xFFFD, 0xFFFD, // Dx
  0x0024, 0xFFFD, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057, 0x0058, 0x0059, 0x005a, 0xFFFD, 0xFFFD, 0xFFFD, 0xFFFD, 0xFFFD, 0xFFFD, // Ex
  0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037, 0x0038, 0x0039, 0xFFFD, 0xFFFD, 0xFFFD, 0xFFFD, 0xFFFD, 0x009f, // Fx
)

class Cp930Decoder implements CharsetDecoder {
  private fatal
  private state?: { shift: boolean, buf: number }

  constructor(options?: CharsetDecoderOptions) {
    this.fatal = options?.fatal ?? true

    IBMKanjiDecodeMap.initialize()
  }

  decode(input: Uint8Array, options?: CharsetDecodeOptions): string {
    let shift = options?.shift ?? false
    const array = new Array<number>()

    if (options?.stream && this.state) {
      shift = this.state.shift
      array.push(this.state.buf)
      this.state = undefined
    }

    for (let i = 0; i < input.length; i++) {
      let fail = false

      const n = input[i]
      if (n === 0x0E) {
        shift = true
      } else if (n === 0x0F) {
        shift = false
      } else if (shift) {
        if (i + 1 < input.length) {
          i++
          const enc = IBMKanjiDecodeMap.get(n << 8 | input[i])
          if (enc != null) {
            array.push(enc)
          } else {
            fail = true
          }
        } else if (options?.stream) {
          this.state = { shift, buf: n }
          break
        } else {
          fail = true
        }
      } else {
        const c = EbcdicDecodeMap[n]
        if (c !== 0xFFFD) {
          array.push(c)
        } else {
          fail = true
        }
      }

      if (fail) {
        if (this.fatal) {
          throw TypeError(`The input ${n.toString(16)} could not be encoded.`)
        } else {
          array.push(0xFFFD)
        }
      }
    }
    return String.fromCharCode(...array)
  }
}

const EbcdicEncodeMap = new PackedMap((m) => {
  const decoder = new Cp930Decoder({ fatal: false })

  m.set(0x85, 0x15)

  const buf = new Uint8Array(1)
  for (let b = 0x00; b <= 0xFF; b++) {
    buf[0] = b
    const decoded = decoder.decode(buf)
    if (decoded && decoded !== "\uFFFD") {
      m.set(decoded.charCodeAt(0), b)
    }
  }
})

class Cp930Encoder implements CharsetEncoder {
  private fatal

  constructor(options?: { fatal?: boolean }) {
    this.fatal = options?.fatal ?? true

    EbcdicEncodeMap.initialize()
    IBMKanjiEncodeMap.initialize()
  }

  canEncode(str: string) {
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i)
      let enc: number | undefined
      if ((enc = EbcdicEncodeMap.get(cp)) != null) { // EBCDIC
        // no handle
      } else if ((enc = IBMKanjiEncodeMap.get(cp)) != null) {
        // no handle
      } else {
        return false
      }
    }
    return true
  }

  encode(str: string, options?: CharsetEncodeOptions): Uint8Array {
    const out = new Array<number>()
    const limit = options?.limit ?? Number.POSITIVE_INFINITY
    let shift = options?.shift ?? false
    let prev = 0
    for (let i = 0; i < str.length; i++) {
      prev = out.length
      const cp = str.charCodeAt(i)

      let enc: number | undefined
      if ((enc = EbcdicEncodeMap.get(cp)) != null) { // EBCDIC
        if (shift) {
          out.push(0x0F)
          shift = false
        }
        out.push(enc)
      } else if ((enc = IBMKanjiEncodeMap.get(cp)) != null) {
        if (!shift) {
          out.push(0x0E)
          shift = true
        }
        out.push((enc >>> 8) & 0xFF)
        out.push(enc & 0xFF)
      } else {
        if (this.fatal) {
          throw TypeError(`The code point ${cp.toString(16)} could not be encoded`)
        } else if (shift) {
          out.push(0x42) // ？
          out.push(0x6F)
        } else {
          out.push(0x6F) // ?
        }
      }

      if (out.length > limit) {
        out.length = prev
        break
      }
    }

    if (shift && options?.shift !== true && out.length < limit) {
      out.push(0x0F)
    }

    return Uint8Array.from(out)
  }
}

export const cp930 = new Cp930Charset()
