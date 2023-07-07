import { Charset, CharsetEncoder } from "../charset/charset.js"
import { utf8 } from "../charset/utf8.js"

export declare type FixlenWriterLayout = {
  columns: FixlenWriterColumn[] | ((values: any[], lineNumber: number) => FixlenWriterColumn[]),
  filler?: string,
  lineSeparator?: string,
}

export declare type FixlenWriterColumn = {
  length: number,
  shift?: boolean,
  fill?: "left" | "right",
  filler?: string,
  type?: "zerofill" | "int-le" | "int-be" | "uint-le" | "uint-be" | "zoned" | "packed",
}

export class FixlenWriter {
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private encoder: CharsetEncoder
  private ebcdic: boolean

  private bom: boolean
  private filler: Uint8Array
  private lineSeparator?: Uint8Array
  private fatal: boolean

  private index: number = 0

  constructor(
    dest: WritableStream<Uint8Array>,
    options?: {
      charset?: Charset,
      bom?: boolean,
      filler?: string,
      lineSeparator?: string,
      fatal?: boolean,
    },
  ) {
    const charset = options?.charset ?? utf8
    this.encoder = charset.createEncoder()
    this.ebcdic = charset.isEbcdic()
    this.bom = charset.isUnicode() ? (options?.bom ?? false) : false
    this.filler = this.encoder.encode(options?.filler || " ")
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

    const cols = Array.isArray(layout.columns) ? layout.columns : layout.columns(values, this.index + 1)
    const filler = layout.filler ? this.encoder.encode(layout.filler) : this.filler
    const lineSeparator = layout.lineSeparator ? this.encoder.encode(layout.lineSeparator) : this.lineSeparator

    let lineLength = 0
    for (let pos = 0; pos < cols.length; pos++) {
      const len = cols[pos].length
      if (len <= 0) {
        throw new RangeError(`column length must be positive: ${len}`)
      }
      lineLength += len
    }
    if (lineSeparator) {
      lineLength += lineSeparator.length
    }
    const buf = new Uint8Array(lineLength)

    let start = 0
    for (let pos = 0; pos < cols.length; pos++) {
      const col = cols[pos]
      const len = col.length
      const shift = col.shift ?? false
      const value = values[pos]
      const isNumber = typeof value === "number" && Number.isFinite(value)
      const type = isNumber ? col.type : undefined
      const fill = col.fill ?? (isNumber ? "right" : "left")

      if (!type) {
        const text = value != null ? value.toString() : ""
        let encoded = this.encoder.encode(text, { shift })
        if (encoded.length > len) {
          if (this.fatal) {
            throw new RangeError("overflow error")
          }
          encoded = this.encoder.encode(text, { shift, limit: len })
        }

        if (encoded.length === len) {
          buf.set(encoded, start)
        } else {
          const cfiller = col.filler ? this.encoder.encode(col.filler, { shift }) : filler

          if ((len - encoded.length) % cfiller.length > 0) {
            throw new RangeError(`filler length is mismatched: ${cfiller.length}`)
          }
          if (fill === "right") {
            for (let i = 0; i < len - encoded.length; i += cfiller.length) {
              buf.set(cfiller, start + i)
            }
            buf.set(encoded, len - encoded.length)
          } else {
            for (let i = 0; i < len - encoded.length; i += cfiller.length) {
              buf.set(cfiller, start + encoded.length + i)
            }
            buf.set(encoded, start)
          }
        }
      } else if (!Number.isInteger(value)) {
        if (this.fatal) {
          throw new RangeError(`value must be integer: ${value}`)
        } else {
          buf.fill(0, start, start + len)
        }
      } else if (type === "zerofill") {
        const encoded = new Uint8Array(len)
        let pos = 0

        const sign = Math.sign(value) < 0
        const text = Math.abs(value).toFixed()
        if (sign) {
          const minus = this.encoder.encode("-", { shift })
          encoded.set(minus, pos)
          pos += minus.length
        }

        const content = this.encoder.encode(text, { shift })
        if (pos + content.length < len) {
          const zero = this.encoder.encode("0", { shift })
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
          buf.fill(0, start, start + len)
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
          buf.fill(0, start, start + len)
        }
      } else if (type.startsWith("uint-")) {
        const view = new DataView(buf.buffer)
        const littleEndien = type === "uint-le"
        if (len === 4) {
          view.setUint32(start, value, littleEndien)
        } else if (len === 2) {
          view.setUint16(start, value, littleEndien)
        } else if (len === 1) {
          view.setUint8(start, value)
        } else if (this.fatal) {
          throw new RangeError("length must be 1, 2 or 4.")
        } else {
          buf.fill(0, start, start + len)
        }
      } else if (type === "zoned") {
        const sign = Math.sign(value) < 0
        const text = Math.abs(value).toFixed()
        if (this.fatal && len < text.length) {
          throw new RangeError(`length is too short: ${len}`)
        }

        for (let i = 0; i < len; i++) {
          let n = (i < len - text.length) ? 0 : text.charCodeAt(i - (len - text.length)) - 0x30
          if (n > 0xA) {
            if (this.fatal) {
              throw new RangeError(`Invalid value: ${n}`)
            } else {
              n = 0
            }
          }
          if (i === len - 1) {
            buf[start + i] = (sign ? 0xD0 : 0xC0) | n
          } else {
            buf[start + i] = (this.ebcdic ? 0xF0 : 0x30) | n
          }
        }
      } else if (type === "packed") {
        const sign = Math.sign(value) < 0
        const text = Math.abs(value).toFixed()
        if (this.fatal && len < Math.ceil((text.length + 1) / 2)) {
          throw new RangeError(`length is too short: ${len}`)
        }

        buf[start + len - 1] = sign ? 0x0D : 0x0C
        for (let i = 0; i < text.length; i++) {
          let n = text.charCodeAt(text.length - 1 - i) - 0x30
          if (n > 0xA) {
            if (this.fatal) {
              throw new RangeError(`Invalid value: ${n}`)
            } else {
              n = 0
            }
          }
          if (i % 2 == 1) {
            buf[start + len - 1 - ((i + 1) >>> 1)] = n
          } else {
            buf[start + len - 1 - (i >>> 1)] |= n << 4
          }
        }
      } else {
        throw new RangeError(`unknown column type: ${type}`)
      }
      start += len
    }

    if (lineSeparator) {
      buf.set(lineSeparator, buf.length - lineSeparator.length)
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
