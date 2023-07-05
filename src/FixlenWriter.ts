import { Charset, CharsetEncoder } from "./charset/charset.js"
import { utf8 } from "./charset/utf8.js"

export declare type FixlenWriterLayout = {
  lineLength: number,
  columns: FixlenWriterColumn[] | ((values: any[], lineNumber: number) => FixlenWriterColumn[]),
}

export declare type FixlenWriterColumn = {
  length: number,
  filler?: string,
  type?: "zerofill" | "int-le" | "int-be" | "uint-le" | "uint-be" | "zoned" | "packed",
}

export class FixlenWriter {
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private encoder: CharsetEncoder
  private ebcdic: boolean

  private bom: boolean
  private lineSeparator?: Uint8Array
  private fatal: boolean

  private index: number = 0

  constructor(
    dest: WritableStream<Uint8Array>,
    options?: {
      charset?: Charset,
      bom?: boolean,
      lineSeparator?: string,
      fatal?: boolean,
    },
  ) {
    const charset = options?.charset ?? utf8
    this.encoder = charset.createEncoder()
    this.ebcdic = charset.isEbcdic()
    this.bom = charset.isUnicode() ? options?.bom ?? false : false
    this.lineSeparator = options?.lineSeparator ? this.encoder.encode(options.lineSeparator) : undefined
    this.fatal = options?.fatal ?? true

    this.writer = dest.getWriter()
  }

  async write(values: any[], layout: FixlenWriterLayout) {
    this.index++

    if (this.bom) {
      await this.writer.write(this.encoder.encode("\uFEFF"))
      this.bom = false
    }

    const buf = new Uint8Array(layout.lineLength)
    const cols = Array.isArray(layout.columns) ? layout.columns : layout.columns(values, this.index + 1)

    let start = 0
    for (let i = 0; i < cols.length; i++) {
      const col = cols[i]
      const len = col.length
      const filler = col.filler ?? " "
      const value = values[i]
      const isNumber = typeof value === "number" && Number.isFinite(value)
      const type = isNumber ? col.type : undefined

      if (len === 0) {
        // no handle
      } else if (!type) {
        let text = value ? value.toString() : ""
        if (text.length < len) {
          if (isNumber) {
            text = filler.repeat(len - text.length) + text
          } else {
            text = text + filler.repeat(len - text.length)
          }
        }

        const encoded = this.encoder.encode(text)
        if (encoded.length === len) {
          buf.set(encoded, start)
        } else {
          buf.set(encoded.subarray(0, len), start)
        }
      } else if (!Number.isInteger(value)) {
        if (this.fatal) {
          throw new RangeError(`value must be integer: ${value}`)
        } else {
          for (let i = 0; i < len; i++) {
            buf[start + i] = 0
          }
        }
      } else if (type === "zerofill") {
        const encoded = new Uint8Array(len)
        let pos = 0

        const sign = Math.sign(value) < 0
        const text = Math.abs(value).toFixed()
        if (sign) {
          const minus = this.encoder.encode("-")
          encoded.set(minus, pos)
          pos += minus.length
        }

        const content = this.encoder.encode(text)
        if (pos + content.length < len) {
          const zero = this.encoder.encode("0")
          for (; pos < len - content.length; pos += zero.length) {
            encoded.set(zero, pos)
          }
        }
        if (pos + content.length === len) {
          encoded.set(content, len - content.length)
          buf.set(encoded, start)
        } else if (this.fatal) {
          throw new RangeError(`overflow error: ${value}`)
        } else {
          for (let i = 0; i < len; i++) {
            buf[start + i] = 0
          }
        }
      } else if (type.startsWith("int-")) {
        const view = new DataView(buf.buffer)
        const littleEndien = type === "int-le"
        if (len === 4) {
          view.setInt32(start, value, littleEndien)
        } else if (len === 2) {
          view.setInt16(start, value, littleEndien)
        } else if (len === 1) {
          view.setInt8(start, value)
        } else if (this.fatal) {
          throw new RangeError("byte length must be 1, 2 or 4.")
        } else {
          for (let i = 0; i < len; i++) {
            buf[start + i] = 0
          }
        }
      } else if (type.startsWith("uint-")) {
        const view = new DataView(buf.buffer)
        const littleEndien = type === "int-le"
        if (len === 4) {
          view.setUint32(start, value, littleEndien)
        } else if (len === 2) {
          view.setUint16(start, value, littleEndien)
        } else if (len === 1) {
          view.setUint8(start, value)
        } else if (this.fatal) {
          throw new RangeError("length must be 1, 2 or 4.")
        } else {
          for (let i = 0; i < len; i++) {
            buf[start + i] = 0
          }
        }
      } else if (type === "zoned") {
        const sign = Math.sign(value) < 0
        const text = Math.abs(value).toFixed()
        if (text.length <= len) {
          const encoded = new Uint8Array(len)
          let pos = 0

          for (let i = 0; i < len - text.length; i++) {
            if (pos + 1 === encoded.length) {
              encoded[pos++] = (sign ? 0b11010000 : 0b1100000)
            } else {
              encoded[pos++] = (this.ebcdic ? 0b11110000 : 0b0011000)
            }
          }
          for (let i = 0; i < text.length; i++) {
            const n = (text.charCodeAt(i) - 0x50) & 0b1111
            if (pos + 1 === encoded.length) {
              encoded[pos++] = (sign ? 0b11010000 : 0b1100000) | n
            } else {
              encoded[pos++] = (this.ebcdic ? 0b11110000 : 0b0011000) | n
            }
          }
          buf.set(encoded, start)
        } else if (this.fatal) {
          throw new RangeError(`length is too short: ${len}`)
        } else {
          for (let i = 0; i < len; i++) {
            buf[start + i] = 0
          }
        }
      } else if (type === "packed") {
        const sign = Math.sign(value) < 0
        let text = Math.abs(value).toFixed()
        if (text.length % 2 === 0) {
          text = "0" + text
        }
        if (text.length <= len * 2) {
          const encoded = new Uint8Array(len)
          const blen = Math.ceil(text.length / 2)
          let pos = len - blen

          for (let i = 0; i < blen; i++) {
            const n1 = (text.charCodeAt(i * 2) - 0x50) & 0xF
            let n2
            if (i + 1 === blen) {
              n2 = sign ? 0x1101 : 0x1100
            } else {
              n2 = (text.charCodeAt(i * 2 + 1) - 0x50) & 0xF
            }
            encoded[pos++] = (n1 << 4) | n2
          }
        } else if (this.fatal) {
          throw new RangeError(`length is too short: ${len}`)
        } else {
          for (let i = 0; i < len; i++) {
            buf[start + i] = 0
          }
        }
      } else {
        throw new RangeError(`unknown column type: ${type}`)
      }
      start += len
    }
    if (this.lineSeparator) {
      buf.set(this.lineSeparator, start)
    }

    await this.writer.write(buf)
    this.index++
  }

  async close() {
    if (this.bom) {
      await this.writer.write(this.encoder.encode("\uFEFF"))
      this.bom = false
    }
    await this.writer.close()
  }
}
